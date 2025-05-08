// src/pages/HomePage.jsx
import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Wrap,
  WrapItem,
  Button,
  Text,
  Heading,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

import Header from "../components/Header";
import DateFilterDropdown from "../components/DateFilterDropdown";
import { useNavigate , useLocation } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext"; // 다시 추가
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import HotDestinations from "../components/HotDestinations";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();  const { travelData } = useTravel(); // 복구 완료
  const dateRange = travelData.dateRange || [null, null];
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token && !isLoggedIn) {
      console.log("토큰 감지: 로그인 처리 시작");
      
      // 1. 먼저 localStorage에 토큰 저장
      localStorage.setItem("token", token);
      
      // 2. axios 기본 헤더 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 3. 사용자 정보 가져오기
      axios.get('http://localhost:3000/user/profile')
        .then(response => {
          if (response.data.success) {
            const userName = response.data.data.name;
            console.log("사용자 정보 로드 성공:", userName);
            
            // 4. 로그인 처리
            login(userName, token);
            
            // 5. URL에서 토큰 제거 (주소창 정리)
            navigate('/', { replace: true });
            
            // 6. 페이지 새로고침 (상태 완전 적용)
            window.location.reload();
          }
        })
        .catch(error => {
          console.error("사용자 정보 로드 실패:", error);
          // 실패 시 토큰 제거
          localStorage.removeItem("token");
          delete axios.defaults.headers.common['Authorization'];
        });
    }
  }, [location, navigate, login, isLoggedIn]);
  
  const handleSearch = () => {
    if (!dateRange[0] || !dateRange[1]) {
      alert("체크인과 체크아웃 날짜를 모두 선택해주세요!");
      return;
    }
    navigate("/survey/people");
  };

  return (
    <Box bg="white">
      <Header />

      <Box textAlign="center" bgGradient="linear(to-b, blue.200, white)" py={10}>
        <Heading size="xl">느낌표와 함께 최고의 여행을 떠나보세요!</Heading>

        <Button colorScheme="blue" mt={4} onClick={() => navigate("/survey/people")}>
          시작하기
        </Button>

        <HStack mt={4} justify="center">
          <DateFilterDropdown />
          <IconButton
            icon={<SearchIcon />}
            colorScheme="blue"
            aria-label="검색"
            onClick={handleSearch}
          />
        </HStack>
      </Box>

      <Grid templateColumns="repeat(3, 1fr)" gap={6} p={10}>
      <GridItem colSpan={2}>
        <HotDestinations /> {/* 핫한 여행지 슬라이드 카드 */}
      </GridItem>

        <GridItem w="100%" bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <Text fontWeight="bold" mb={2}>최근 일정</Text>
          <Wrap spacing={3} mt={2}>
            <WrapItem>
              <Button size="sm" colorScheme="blue" onClick={() => navigate("/plan/namhae")}>
                남해 여행
              </Button>
            </WrapItem>
            <WrapItem>
              <Button size="sm" colorScheme="blue" onClick={() => navigate("/plan/jindo")}>
                진도 여행
              </Button>
            </WrapItem>
            <WrapItem>
              <Button size="sm" colorScheme="blue" onClick={() => navigate("/plan/jeju")}>
                제주도 여행
              </Button>
            </WrapItem>
            <WrapItem>
              <Button size="sm" variant="outline" colorScheme="teal" onClick={() => navigate("/my-plan")}>
                내 일정 보기
              </Button>
            </WrapItem>
          </Wrap>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default HomePage;
