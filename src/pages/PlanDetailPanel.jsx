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
import InviteModal from "../components/InviteModal";

/* ─────────────────────────────────────────────────────────────── */

export default function PlanDetailPanel() {
  /* ─── hooks & state ───────────────── */
  const { tripId }  = useParams();
  const { token }   = useAuth();
  const toast       = useToast();

  const modalCtrl   = useDisclosure();
  const reviewModal = useDisclosure();
  const inviteModal = useDisclosure();

  const [plan, setPlan]       = useState({ days: [] });
  const [selectedDay, setSel] = useState(0);
  const [curPlace, setCur]    = useState(null);
  const [reviews, setReviews] = useState([]);

  /** 이미 리뷰를 작성한 여행지 id Set */
  const [reviewedDestinations, setReviewedDestinations] = useState(new Set());

  /** 여행 이름 · 시작 · 끝 날짜 */
  const [tripMeta, setTripMeta] = useState({
    name : "",
    start: "",
    end  : "",
    schedule_id: ""
  });

  const dates      = plan.days.map(d => d.date);
  const DEMO_MODE  = false;

  /* ──────────────────────────────────── */
  /* 1. 일정 + 내 리뷰 Dest Set 한 번에 로드 */
  // PlanDetailPanel.jsx의 useEffect에서 데이터 로딩 부분만 수정

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
      console.log(" <<< planRes >>> ",planRes);
      console.log(" <<< reviewRes >>> ",reviewRes);

      /* 리뷰 id 배열 → Set */
      setReviewedDestinations(new Set(reviewRes.data?.data ?? []));

      /* 일정 파싱 (destinationId 반드시 존재) */
      const pdata = planRes.data;
      if (pdata.result_code !== 200 && !pdata.schedule)
        throw new Error("load fail");

      // 날짜 키 (미정 제외) 정렬
      const rawKeys = Object.keys(pdata.schedule)
        .filter(d => d !== "미정")
        .sort();                           // ISO 문자열이므로 그대로 날짜순

      const days = rawKeys.map((date, i) => ({
        day : i + 1,
        date,
        items: pdata.schedule[date]
          .filter(p => !p.isHidden && p.isHidden !== 1)  // 🚀 is_hidden 필터링 추가
          .map(p => ({
            id:            p.id,
            title:         p.name ?? p["여행지명"],
            time:          p.time ?? "12:00",
            image:         p.image ?? "",
            lat:           parseFloat(p.latitude)  || 0,
            lng:           parseFloat(p.longitude) || 0,
            destinationId: p.destinationId ?? p.id,
            tags:          [],
            isHidden:     p.isHidden || 0  // 디버깅용으로 유지
          }))
      }));

      setPlan({ days });

      /* 여행 메타정보 세팅 */
      setTripMeta({
        name : pdata.trip?.schedule_name ?? pdata.schedule_name ?? "",
        start: rawKeys[0]   ?? "",
        end  : rawKeys.at(-1) ?? "",
        schedule_id: pdata.trip?.id ?? pdata.schedule_id ?? ""
      });

      // 🔍 디버깅: 숨겨진 항목 확인
      const hiddenCount = Object.values(pdata.schedule)
        .flat()
        .filter(p => p.isHidden || p.isHidden === 1).length;
      
      if (hiddenCount > 0) {
        console.log(`🙈 숨겨진 여행지 ${hiddenCount}개가 목록에서 제외되었습니다.`);
      }

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
  /* 3. 일정 삭제 */
  const deleteSchedule = async (dateKey, sdId) => {
    const dayObj = plan.days.find(d => d.date === dateKey);
    const target = dayObj?.items.find(it => it.id === sdId);
    if (!target) return;

    /* UI 낙관적 삭제 */
    setPlan(prev => {
      const cp = { ...prev };
      const day = cp.days.find(d => d.date === dateKey);
      if (day) day.items = day.items.filter(it => it.id !== sdId);
      return cp;
    });

    if (DEMO_MODE) { toast({ title:"(데모) 삭제 완료", status:"success" }); return; }

    try {
      await axios.delete(
        `http://localhost:3000/trip/${tripId}/schedule/hide`,
        {
          data: { destination_name: target.title },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast({ title:"삭제 완료", status:"success" });
    } catch (err) {
      toast({ title:"삭제 실패", status:"error" });
      /* 롤백 */
      setPlan(prev => {
        const cp = { ...prev };
        const day = cp.days.find(d => d.date === dateKey);
        if (day && !day.items.find(it => it.id === sdId)) day.items.push(target);
        return cp;
      });
    }
  };

  /* ──────────────────────────────────── */
  /* 4. 리뷰 CRUD */
  const fetchReviews = async (destId) => {
    try {
      console.log(" <<< destId >>> ",destId);
      const { data } = await axios.get(
        `http://localhost:3000/review/place/${destId}`,
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      console.log(" <<< data >>> ",data);
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
        { destination_id: curPlace.destinationId, rating, content },
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      await fetchReviews(curPlace.destinationId);               // 동기화
      setReviewedDestinations(prev => new Set(prev).add(curPlace.destinationId));
      toast({ title:"리뷰 저장 완료", status:"success" });
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

      if (!rest.some(r => r.destination_id === curPlace.destinationId)) {
        setReviewedDestinations(prev => {
          const ns = new Set(prev);
          ns.delete(curPlace.destinationId);
          return ns;
        });
      }
    } catch (e) { console.error(e); }
  };

  /* ──────────────────────────────────── */
  /* 5. “최적 동선 보기” */
  const optimizeRoute = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/trip/${tripId}/route`,
        { plan },
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      setPlan(data);
      toast({ title:"최적 동선 적용!", status:"success" });
    } catch (err) {
      console.error(err);
      toast({ title:"동선 계산 실패", status:"error" });
    }
  };

  /* ──────────────────────────────────── */
  /* 6. 일정 추가 (필요 시 구현) */
  const addSchedule = async (dateKey, newItem) => {
    // 날짜 타임존 보정 (한국 시간 기준)
    const adjustedDate = dateKey; 
    // const adjustedDate = new Date(dateKey + 'T00:00:00+09:00').toISOString().split('T')[0];
    console.log(" <<< adjustedDate >>> ",adjustedDate);
    
    // 1. 낙관적 UI 업데이트는 하지 않음 (장소 검증 후에만 추가)
    
    // 2. 서버에 저장 요청
    try {
      const response = await axios.post(
        `http://localhost:3000/trip/${tripId}/schedule`,
        {
          destination_name: newItem.title,
          visit_date: adjustedDate,  // 보정된 날짜 사용
          visit_time: newItem.time,
          description: newItem.description || "",
          // 좌표는 백엔드에서 카카오 API로 자동 검색
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // 3. 서버 응답 처리
      if (response.data.result_code === 201) {
        // 성공: 백엔드에서 카카오 API로 장소를 찾은 경우
        const newScheduleItem = {
          id: response.data.data?.sdId,
          title: newItem.title,
          time: newItem.time,
          description: newItem.description || "",
          lat: response.data.data?.latitude || 0,
          lng: response.data.data?.longitude || 0,
          destinationId: response.data.data?.destinationId,
          image: response.data.data?.image || "",
          tags: newItem.tags || []
        };
  
        setPlan(prev => {
          const updatedPlan = { ...prev };
          const dayIndex = updatedPlan.days.findIndex(d => d.date === dateKey);
          
          if (dayIndex !== -1) {
            updatedPlan.days[dayIndex].items = [
              ...updatedPlan.days[dayIndex].items,
              newScheduleItem
            ];
          }
          
          return updatedPlan;
        });
  
        toast({
          title: "일정이 추가되었습니다",
          status: "success",
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error("일정 추가 실패:", error);
      
      // 404 에러: 카카오 API에서 장소를 찾지 못한 경우
      if (error.response?.status === 404) {
        toast({
          title: "장소를 찾을 수 없습니다",
          description: `"${newItem.title}" 장소를 찾을 수 없습니다. 다른 이름으로 검색해주세요.`,
          status: "warning",
          duration: 5000,
          isClosable: true
        });
      } else {
        // 기타 에러
        toast({
          title: "일정 추가 실패",
          description: error.response?.data?.message || "일정을 추가할 수 없습니다",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      }
    }
  };

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

        {/* ─ 최적 동선 버튼 ─ */}
        <Button colorScheme="teal" onClick={optimizeRoute}>
          🚗 최적 동선 보기
        </Button>

        {/* ─ 일정 이메일 공유 버튼 ─ */}
        <Button colorScheme="pink" onClick={inviteModal.onOpen}>
          📧 일정 이메일 공유
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
                                onDelete={() => deleteSchedule(day.date, it.id)}
                                onReview={async () => {
                                  setCur(it);
                                  console.log(" <<< it >>> ",it);
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

      {/* 일정 공유 모달 */}
      <InviteModal
        isOpen={inviteModal.isOpen}
        onClose={inviteModal.onClose}
        regionName={tripMeta.name}
        startDate={tripMeta.start}
        endDate={tripMeta.end}
        scheduleId={tripMeta.schedule_id}
      />

      {/* 리뷰 모달 */}
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
