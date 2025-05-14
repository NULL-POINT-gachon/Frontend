import React, { useEffect, useState } from "react";
import {
  Box, VStack, HStack, Tabs, Tab, TabList,
  TabPanels, TabPanel, Button, IconButton,
  Text, useDisclosure, useToast
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import MapPreview from "../components/MapPreview";
import ScheduleCard from "../components/ScheduleCard";
import AddScheduleModal from "../components/AddScheduleModal";
import ReviewModal from "../components/ReviewModal";
import { Flex } from "@chakra-ui/react";

export default function PlanDetailPanel() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const toast = useToast();
  const modalCtrl = useDisclosure();
  const reviewModal = useDisclosure();
  const [plan, setPlan] = useState({ days: [] });
  const [selectedDay, setSel] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [curPlace, setCurPlace] = useState(null);
  const dates = plan.days.map(d => d.date);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/trip/${tripId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.result_code !== 200) throw new Error("load fail");

        const days = Object.keys(data.schedule)
          .filter(d => d !== "미정")
          .sort()
          .map((date, i) => ({
            day: i + 1,
            date,
            items: data.schedule[date].map(p => ({
              id: p.id,
              title: p.name ?? p["여행지명"],
              time: p.time ?? "12:00",
              image: p.image ?? "",
              lat: parseFloat(p.latitude) || 0,
              lng: parseFloat(p.longitude) || 0,
              destinationId: p.destinationId ?? p.destination_id ?? p.id,
              tags: []
            }))
          }));
        setPlan({ days });
      } catch (err) {
        console.error(err);
        toast({ title: "일정 불러오기 실패", status: "error" });
      }
    })();
  }, [tripId, token, toast]);

  const onDragEnd = (res) => {
    if (!res.destination) return;
    setPlan(prev => {
      const cp = { ...prev };
      const list = [...cp.days[selectedDay].items];
      const [mv] = list.splice(res.source.index, 1);
      list.splice(res.destination.index, 0, mv);
      cp.days[selectedDay].items = list;
      return cp;
    });
  };

  const addSchedule = async (dateKey, item) => {
    const tempId = `temp-${Date.now()}`;
    setPlan(prev => {
      const cp = { ...prev };
      const day = cp.days.find(d => d.date === dateKey);
      if (day) day.items.push({ ...item, id: tempId });
      return cp;
    });

    try {
      const { data } = await axios.post(
        `http://localhost:3000/trip/${tripId}/schedule`,
        {
          title: item.title,
          description: item.description ?? '',
          visit_date: dateKey,
          visit_time: item.time,
          transport: item.tags?.[0] || '도보'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sdId = data.data.sdId;
      setPlan(prev => {
        const cp = { ...prev };
        const day = cp.days.find(d => d.date === dateKey);
        if (day) {
          const i = day.items.findIndex(v => v.id === tempId);
          if (i > -1) day.items[i].id = sdId;
        }
        return cp;
      });
      toast({ title: '일정이 추가되었습니다!', status: 'success' });
    } catch (err) {
      console.error(err);
      setPlan(prev => {
        const cp = { ...prev };
        const day = cp.days.find(d => d.date === dateKey);
        if (day) day.items = day.items.filter(v => v.id !== tempId);
        return cp;
      });
      toast({ title: '추가 실패', status: 'error' });
    }
  };

  const deleteSchedule = async (dateKey, sdId) => {
    const backup = JSON.parse(JSON.stringify(plan));
    setPlan(prev => {
      const cp = { ...prev };
      const day = cp.days.find(d => d.date === dateKey);
      if (day) day.items = day.items.filter(v => v.id !== sdId);
      return cp;
    });

    try {
      await axios.delete(
        `http://localhost:3000/trip/${tripId}/schedule/${sdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: '삭제되었습니다', status: 'info' });
    } catch (err) {
      console.error(err);
      setPlan(backup);
      toast({ title: '삭제 실패', status: 'error' });
    }
  };

  const fetchReviews = async (destinationId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/review/place/${destinationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(data.data || []);
    } catch (e) { console.error(e); }
  };

  const addReview = async ({ rating, content }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/review",
        {
          destination_id: curPlace.destinationId ?? curPlace.id, rating, content
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(prev => [...prev, res.data.data]);
    } catch (e) { console.error(e); }
  };

  const editReview = async ({ id, rating, content }) => {
    try {
      await axios.put(
        `http://localhost:3000/review/${id}`,
        { rating, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(prev => prev.map(r => r.id === id ? { ...r, rating, content } : r));
    } catch (e) { console.error(e); }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/review/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
  };

  const optimizeRoute = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/trip/${tripId}/route`,
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(data);
      toast({ title: "최적 동선 적용!", status: "success" });
    } catch (err) {
      toast({ title: "동선 계산 실패", status: "error" });
    }
  };

  if (!plan.days.length) return <Box p={10}><Text>로딩 중…</Text></Box>;

  return (
    <Box>
      <MapPreview items={plan.days[selectedDay].items} height="300px" />
      <HStack p={4} spacing={3}>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => {
          if (!dates.length) {
            toast({ title: "날짜 정보가 없습니다", status: "warning" });
            return;
          }
          modalCtrl.onOpen();
        }}>
          장소에서 일정 추가
        </Button>
        <Button colorScheme="teal" onClick={optimizeRoute}>
          🚗 최적 동선 보기
        </Button>
      </HStack>
      <Tabs index={selectedDay} onChange={setSel} variant="enclosed">
        <TabList>{plan.days.map((d, i) => <Tab key={i}>{d.date}</Tab>)}</TabList>
        <TabPanels>
          {plan.days.map((day, i) => (
            <TabPanel key={i} p={0}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`list-${i}`}>
                  {prov => (
                    <VStack ref={prov.innerRef} {...prov.droppableProps} spacing={4} p={4}>
                      {day.items.map((it, idx) => (
                        <Draggable key={it.id} draggableId={`${it.id}`} index={idx}>
                          {p => (
                            <Flex ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                              <ScheduleCard
                                item={it}
                                onDelete={() => deleteSchedule(day.date, it.id)}
                                onReview={() => {
                                  setCurPlace(it);
                                  fetchReviews(it.destinationId ?? it.id);
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
