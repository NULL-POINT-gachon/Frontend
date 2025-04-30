// src/pages/PlanDetailPage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
} from "@chakra-ui/react";
import Header from "../components/Header";
// import InviteModal from "../components/InviteModal";
// import ReviewModal from "../components/ReviewModal";
// import AddScheduleModal from "../components/admin/AddScheduleModal";
import ScheduleCard from "../components/ScheduleCard";

const PlanDetailPage = () => {
  const { region } = useParams();

  const {
    isOpen: isInviteOpen,
    onOpen: onInviteOpen,
    onClose: onInviteClose,
  } = useDisclosure();

  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const regionNameMap = {
    namhae: "남해",
    jindo: "진도",
    jeju: "제주도",
    sokcho: "속초",
    busan: "부산",
  };
  const regionName = regionNameMap[region] || region;

  const tripDays = ["1일차", "2일차", "3일차"];

  const [schedule, setSchedule] = useState([
    {
      day: "1일차",
      title: "남해항",
      desc: "아름다운 항구 전망과 해산물",
      time: "10:00",
      transport: "자동차",
    },
    {
      day: "1일차",
      title: "독일마을",
      desc: "이국적인 분위기의 건축물과 카페",
      time: "14:00",
      transport: "도보",
    },
  ]);

  const handleAddSchedule = (newItem) => {
    setSchedule([...schedule, newItem]);
  };

  const handleDeleteSchedule = (targetItem) => {
    setSchedule(schedule.filter((item) => item !== targetItem));
  };

  const handleOptimizeRoute = () => {
    alert("최적 경로를 계산 중입니다... (추후 API 연동 예정)");
  };

  return (
    <>
      <Header />
      <Box bgGradient="linear(to-b, blue.200, white)" py={10} textAlign="center" />
      <Box bg="gray.50" minH="100vh" p={6}>
        <HStack align="start" spacing={6}>
          <Box w="220px" bg="blue.100" p={4} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={4}>일정 관리</Heading>
            <VStack align="stretch" spacing={2}>
              <Button variant="solid" colorScheme="blue">남해 여행</Button>
              <Button variant="solid" colorScheme="blue">진도 여행</Button>
              <Button variant="solid" colorScheme="blue">제주도 여행</Button>
            </VStack>
          </Box>

          <Box flex="1">
            <Heading mb={4}>{regionName?.toUpperCase()} 여행 일정</Heading>
            <Text mb={6}>최적의 경로와 시간을 구성해보세요.</Text>

            {/* 지도 영역 안내 박스 */}
            <Box flex="1" bg="gray.100" p={6} mb={4}>
              <Box bg="white" p={6} borderRadius="md" boxShadow="md" textAlign="center">
                <Text fontSize="lg" fontWeight="semibold">📍 추후 지도 연동 예정</Text>
                <Text color="gray.600" mt={2}>Google Maps 또는 Kakao Maps 연동 가능합니다.</Text>
              </Box>
            </Box>

            <HStack justify="flex-end" mb={4} spacing={2}>
              <Button colorScheme="green" onClick={handleOptimizeRoute}>
                🚗 최적 동선 보기
              </Button>
              <Button colorScheme="blue" onClick={onAddOpen}>일정 추가 / 삭제</Button>
              <Button variant="outline" colorScheme="blue" onClick={onInviteOpen}>일정 공유</Button>
            </HStack>

            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                {tripDays.map((day) => (
                  <Tab key={day}>{day}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {tripDays.map((day) => (
                  <TabPanel key={day}>
                    <VStack align="stretch" spacing={4}>
                      {schedule.filter((item) => item.day === day).map((item, idx) => (
                        <ScheduleCard
                          key={idx}
                          item={item}
                          onDelete={() => handleDeleteSchedule(item)}
                          onReview={onReviewOpen}
                        />
                      ))}
                      {schedule.filter((item) => item.day === day).length === 0 && (
                        <Text>{day} 일정은 준비 중입니다.</Text>
                      )}
                    </VStack>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </HStack>

        {/* 향후 모달 복원 예정 */}
        {/* <InviteModal isOpen={isInviteOpen} onClose={onInviteClose} regionName={regionName} startDate="2025.3.15" endDate="2025.3.18" />
        <ReviewModal isOpen={isReviewOpen} onClose={onReviewClose} />
        <AddScheduleModal isOpen={isAddOpen} onClose={onAddClose} onAdd={handleAddSchedule} /> */}
      </Box>
    </>
  );
};

export default PlanDetailPage;
