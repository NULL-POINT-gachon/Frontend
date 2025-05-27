// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Grid, GridItem, Wrap, WrapItem, Button, Text,
  Heading, IconButton, HStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import DateFilterDropdown from "../components/DateFilterDropdown";
import HotDestinations from "../components/HotDestinations";
import { useTravel } from "../contexts/TravelContext";
import { useAuth } from "../contexts/AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- 컨텍스트 ---------- */
  const { travelData } = useTravel();
  const { login, isLoggedIn } = useAuth();

  /* ---------- 최근 일정 ---------- */
  const [recentTrips, setRecentTrips] = useState([]);
  const { token } = useAuth();
  /* ---------- ❶ 토큰 처리(useEffect 그대로 유지) ---------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token && !isLoggedIn) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios.get("http://localhost:3000/user/profile")
        .then(({ data }) => {
          if (data.success) {
            login(data.data.name, token);
            navigate("/", { replace: true });
            window.location.reload();
          }
        })
        .catch(err => {
          console.error("사용자 정보 로드 실패:", err);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        });
    }
  }, [location, isLoggedIn, login, navigate]);

  /* ---------- ❷ 최근 일정 불러오기 ---------- */
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchRecentTrips = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/trip/all",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          },
          { params: { page: 1, limit: 5 } },
        );
        if (data.result_code === 200) setRecentTrips(data.trips);
      } catch (err) {
        console.error("최근 일정 불러오기 실패:", err);
      }
    };

    fetchRecentTrips();
  }, []);

  /* ---------- 일정 클릭 ---------- */
  const goTrip = (tripId) => navigate(`/my-plan/${tripId}`);

  /* ---------- 검색 버튼 ---------- */
  const handleSearch = () => {
    const [checkIn, checkOut] = travelData.dateRange || [null, null];
    if (!checkIn || !checkOut) {
      alert("체크인과 체크아웃 날짜를 모두 선택해주세요!");
      return;
    }
    navigate("/survey/people");
  };

  /* ---------- UI ---------- */
  return (
    <Box bg="white">
      <Header />

      {/* 히어로 섹션 */}
      <Box textAlign="center" bgGradient="linear(to-b, blue.200, white)" py={10}>
        <Heading size="xl">느낌표와 함께 최고의 여행을 떠나보세요!</Heading>
        <Button colorScheme="blue" mt={4} onClick={() => navigate("/survey/people")}>
          시작하기
        </Button>
        <HStack mt={4} justify="center">
          <DateFilterDropdown />
        </HStack>
      </Box>

      {/* 콘텐츠 그리드 */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} p={10}>
        <GridItem colSpan={2}>
          <HotDestinations />
        </GridItem>

        {/* 최근 일정 카드 */}
        <GridItem w="100%" bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <Text fontWeight="bold" mb={2}>최근 일정</Text>

          {recentTrips.length === 0 ? (
            <Text fontSize="sm" color="gray.500">최근 일정이 없습니다.</Text>
          ) : (
            <Wrap spacing={3} mt={2}>
              {recentTrips.map((trip) => (
                <WrapItem key={trip.식별자}>
                  <Button size="sm" colorScheme="blue" onClick={() => goTrip(trip.식별자)}>
                    {trip.여행일정명}
                  </Button>
                </WrapItem>
              ))}
              <WrapItem>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="teal"
                  onClick={() => navigate("/my-plan")}
                >
                  내 일정 보기
                </Button>
              </WrapItem>
            </Wrap>
          )}
        </GridItem>
      </Grid>
      <Box bg="gray.50" py={10} px={4} mt={20}>
      <Heading size="md" textAlign="center" mb={8}>
        ✨ 느낌표 사용 가이드
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6} textAlign="center">
        <Box>
          <Text fontSize="3xl">📅</Text>
          <Text mt={2} fontWeight="semibold">1단계</Text>
          <Text fontSize="sm">여행 날짜를 선택하세요</Text>
        </Box>

        <Box>
          <Text fontSize="3xl">📝</Text>
          <Text mt={2} fontWeight="semibold">2단계</Text>
          <Text fontSize="sm">여행 설문에 응답하세요</Text>
        </Box>

        <Box>
          <Text fontSize="3xl">📍</Text>
          <Text mt={2} fontWeight="semibold">3단계</Text>
          <Text fontSize="sm">AI 추천 여행지를 확인하세요</Text>
        </Box>

        <Box>
          <Text fontSize="3xl">🧳</Text>
          <Text mt={2} fontWeight="semibold">4단계</Text>
          <Text fontSize="sm">일정을 저장하고 공유해보세요!</Text>
        </Box>
      </Grid>
    </Box>

      
    </Box>
  );
}

export default HomePage;
