import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Heading, Text, VStack, HStack, Tabs, Tab, TabList,
  TabPanels, TabPanel, Button, useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import InviteModal from "../components/InviteModal";
import ReviewModal from "../components/ReviewModal";
import AddScheduleModal from "../components/AddScheduleModal";
import ScheduleCard from "../components/ScheduleCard";

export default function PlanDetailPanel() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [schedule, setSchedule] = useState([]);

  /* 모달 */
  const invite = useDisclosure();
  const review = useDisclosure();
  const addSch = useDisclosure();

  /* trip 로딩 */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/trip/${tripId}`,);
        if (data.result_code === 200) {
          setTrip(data.trip);
          // API가 schedule 객체로 리턴하므로 그대로 세팅
          setSchedule(data.schedule || {});
        }
      } catch (e) { console.error(e); }
    })();
  }, [tripId]);

  if (!trip) return <Text>로딩 중…</Text>;

  /* ---- 이하 UI ---- */
  const dates = Object.keys(schedule).sort(); // ex. ["2025-05-12","2025-05-13"]; // 예시

  const addSchedule = (item) => setSchedule([...schedule, item]);
  const deleteSchedule = (item) => setSchedule(schedule.filter(v => v !== item));

  return (
    <>
      <Heading mb={4}>{trip.여행일정명}</Heading>
      <Text mb={6}>
        {trip.출발일자.slice(0,10)} ~ {trip.마무리일자.slice(0,10)}
      </Text>

      {/* 지도 자리 */}
      <Box bg="gray.100" p={6} mb={4} borderRadius="md" textAlign="center">
        <Text>📍 지도 연동 예정</Text>
      </Box>

      <HStack justify="flex-end" mb={4} spacing={2}>
        <Button colorScheme="green">🚗 최적 동선 보기</Button>
        <Button colorScheme="blue" onClick={addSch.onOpen}>일정 추가 / 삭제</Button>
        <Button variant="outline" colorScheme="blue" onClick={invite.onOpen}>일정 공유</Button>
      </HStack>

      <Tabs variant="enclosed">
        <TabList>
          {dates.map(date => (
            <Tab key={date}>{date}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {dates.map((date, idx) => (
            <TabPanel key={date}>
              <VStack align="stretch" spacing={4}>
                {schedule[date].length > 0 ? (
                  schedule[date].map((item, i) => (
                    <ScheduleCard
                      key={i}
                      item={item}
                      onDelete={() => deleteSchedule(item)}
                      onReview={review.onOpen}
                    />
                  ))
                ) : (
                  <Text>{date} 일정이 없습니다.</Text>
                )}
              </VStack>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* 모달 */}
      <InviteModal isOpen={invite.isOpen} onClose={invite.onClose} regionName={trip.region} />
      <ReviewModal isOpen={review.isOpen} onClose={review.onClose} />
      <AddScheduleModal isOpen={addSch.isOpen} onClose={addSch.onClose} onAdd={addSchedule} />
    </>
  );
}
