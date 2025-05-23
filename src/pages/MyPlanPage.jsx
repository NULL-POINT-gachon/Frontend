import React, { useEffect, useState } from "react";
import {
  Box, Heading, Button, VStack, HStack, Text,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyPlanPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  /* 🔹 일정 목록 로딩 */
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/trip/all",
          { params: { page: 1, limit: 100 } }   // 필요 시 페이징 조정
        );
        if (data.result_code === 200) setTrips(data.trips);
      } catch (e) {
        console.error("일정 목록 불러오기 오류:", e);
      }
    };
    fetchTrips();
  }, []);

  const goToPlan = (tripId) => navigate(`/my-plan/${tripId}`);

  return (
    <>
      <Header />
      <Box bgGradient="linear(to-b, blue.200, white)" py={10} />
      <Box bg="gray.50" minH="100vh" p={6}>
        <HStack align="start" spacing={6}>
          <Box w="260px" bg="blue.100" p={4} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={4}>일정 관리</Heading>

            {trips.length === 0 ? (
              <Text fontSize="sm" color="gray.600">저장된 일정이 없습니다.</Text>
            ) : (
              <VStack align="stretch" spacing={2}>
                {trips.map((t) => (
                  <Button
                    key={t.식별자}
                    colorScheme="blue"
                    onClick={() => goToPlan(t.식별자)}
                  >
                    {t.여행일정명}
                  </Button>
                ))}
              </VStack>
            )}
          </Box>

          <Box flex="1" /> {/* 오른쪽 공간(지도 등) */}
        </HStack>
      </Box>
    </>
  );
};

export default MyPlanPage;
