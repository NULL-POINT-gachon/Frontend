// src/pages/PlanDetailPanel.jsx
import React, { useEffect, useState } from "react";
import {
  Box, VStack, HStack, Tabs, Tab, TabList,
  TabPanels, TabPanel, Button, Text, useDisclosure, useToast, Flex
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import MapPreview from "../components/MapPreview";
import ScheduleCard from "../components/ScheduleCard";
import AddScheduleModal from "../components/AddScheduleModal";
import ReviewModal from "../components/ReviewModal";

export default function PlanDetailPanel() {
  /* ─── hooks & state ───────────────── */
  const { tripId }   = useParams();
  const { token }    = useAuth();
  const toast        = useToast();

  const modalCtrl    = useDisclosure();
  const reviewModal  = useDisclosure();

  const [plan, setPlan]          = useState({ days: [] });
  const [selectedDay, setSel]    = useState(0);

  const [curPlace, setCurPlace]  = useState(null);
  const [reviews,  setReviews]   = useState([]);

  /** ‘리뷰 이미 작성된 여행지 id’ 집합 */
  const [reviewedDestinations, setReviewedDestinations] = useState(new Set());

  const dates = plan.days.map(d => d.date);
  const DEMO_MODE = false;

  /* ──────────────────────────────────── */
  /* 1. 일정 + 내 리뷰 Dest Set 한 번에 로드 */
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const [planRes, reviewRes] = await Promise.all([
          axios.get(`http://localhost:3000/trip/${tripId}`, {
            headers:{ Authorization:`Bearer ${token}` }
          }),
          axios.get("http://localhost:3000/review/user-reviews", {
            headers:{ Authorization:`Bearer ${token}` }
          })
        ]);

        /* 리뷰 → Set(id) : 응답이 [5,6,…] */
        const destSet = new Set(reviewRes.data?.data ?? []);
        setReviewedDestinations(destSet);

        /* 일정 파싱 (destinationId 반드시 존재) */
        const pdata = planRes.data;
        if (pdata.result_code !== 200) throw new Error("load fail");

        const days = Object.keys(pdata.schedule)
          .filter(d => d !== "미정")
          .sort()
          .map((date, i) => ({
            day:  i + 1,
            date,
            items: pdata.schedule[date].map(p => ({
              id:   p.id,
              title:p.name ?? p["여행지명"],
              time: p.time ?? "12:00",
              image:p.image ?? "",
              lat:  parseFloat(p.latitude)  || 0,
              lng:  parseFloat(p.longitude) || 0,
              destinationId: p.destination_id ?? p.id,
              tags:[]
            }))
          }));
        setPlan({ days });

      } catch (err) {
        console.error(err);
        toast({ title:"데이터 로드 실패", status:"error" });
      }
    })();
  }, [tripId, token, toast]);

  /* ──────────────────────────────────── */
  /* 2. Drag & Drop 정렬 */
  const onDragEnd = (res) => {
    if (!res.destination) return;
    setPlan(prev => {
      const cp   = { ...prev };
      const list = [...cp.days[selectedDay].items];
      const [mv] = list.splice(res.source.index, 1);
      list.splice(res.destination.index, 0, mv);
      cp.days[selectedDay].items = list;
      return cp;
    });
  };

  /* ──────────────────────────────────── */
  /* 3. 리뷰 CRUD */
  const fetchReviews = async (destId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/review/place/${destId}`,
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      setReviews(data.data || []);
    } catch (err) {
      console.error(err);
      toast({ title:"리뷰 로드 실패", status:"error" });
    }
  };

  const addReview = async ({ rating, content }) => {
    if (!curPlace) return;

    try {
      await axios.post(
        "http://localhost:3000/review",
        {
          destination_id: curPlace.destinationId,
          rating, content
        },
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      await fetchReviews(curPlace.destinationId);              // 목록 동기화
      setReviewedDestinations(prev => new Set(prev).add(curPlace.destinationId));
      toast({ title:"리뷰가 저장되었습니다!", status:"success" });
    } catch (err) {
      console.error(err.response ?? err);
      toast({ title:"리뷰 저장 실패", status:"error" });
    }
  };

  const editReview = async ({ id, rating, content }) => {
    try {
      await axios.put(
        `http://localhost:3000/review/${id}`,
        { rating, content },
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      setReviews(prev => prev.map(r => r.id === id ? { ...r, rating, content } : r));
    } catch (e) { console.error(e); }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/review/${id}`,
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      const rest = reviews.filter(r => r.id !== id);
      setReviews(rest);

      /* Set에서 제거 필요 시 제거 */
      const stillHas = rest.some(r => r.destination_id === curPlace.destinationId);
      if (!stillHas) {
        setReviewedDestinations(prev => {
          const ns = new Set(prev);
          ns.delete(curPlace.destinationId);
          return ns;
        });
      }
    } catch (e) { console.error(e); }
  };

  /* ──────────────────────────────────── */
  /* 4. 일정 추가 (DEMO 처리만 유지) */
  const addSchedule = () => {};   // 필요 시 기존 로직 붙여 넣기

  /* ──────────────────────────────────── */
  if (!plan.days.length)
    return <Box p={10}><Text>로딩 중…</Text></Box>;

  return (
    <Box>
      <MapPreview items={plan.days[selectedDay].items} height="300px" />

      {/* 상단 버튼 */}
      <HStack p={4} spacing={3}>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => {
            if (!dates.length)
              return toast({ title:"날짜 정보가 없습니다", status:"warning" });
            modalCtrl.onOpen();
          }}
        >
          장소에서 일정 추가
        </Button>
      </HStack>

      {/* 날짜별 탭 */}
      <Tabs index={selectedDay} onChange={setSel} variant="enclosed">
        <TabList>{plan.days.map((d,i)=><Tab key={i}>{d.date}</Tab>)}</TabList>
        <TabPanels>
          {plan.days.map((day,i)=>(
            <TabPanel key={i} p={0}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`list-${i}`}>
                  {prov=>(
                    <VStack ref={prov.innerRef} {...prov.droppableProps} p={4} spacing={4} w="100%">
                      {day.items.map((it,idx)=>(
                        <Draggable key={it.id} draggableId={`${it.id}`} index={idx}>
                          {p=>(
                            <Flex ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} w="100%">
                              <ScheduleCard
                                item={it}
                                hasReview={reviewedDestinations.has(it.destinationId)}
                                onReview={async () => {
                                  setCurPlace(it);
                                  await fetchReviews(it.destinationId);
                                  reviewModal.onOpen();
                                }}
                              />
                            </Flex>
                          )}
                        </Draggable>
                      ))}
                      {prov.placeholder}
                    </VStack>
                  )}
                </Droppable>
              </DragDropContext>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* 모달들 */}
      <AddScheduleModal
        isOpen={modalCtrl.isOpen}
        onClose={modalCtrl.onClose}
        onAdd={addSchedule}
        dates={dates}
      />
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={reviewModal.onClose}
        reviews={reviews}
        onAddReview={addReview}
        onEditReview={editReview}
        onDeleteReview={deleteReview}
      />
    </Box>
  );
}
