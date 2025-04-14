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
} from "@chakra-ui/react";

import Header from "../components/Header";
import TravelSearchFilter from "../components/TravelSearchFilter";
import TravelCardList from "../components/TravelCardList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";  // 사용자 정보 사용

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();  // 로그인 사용자 정보 가져오기

  return (
    <Box bg="white">
      <Header />

      {/* 메인 배너 */}
      <Box textAlign="center" bgGradient="linear(to-b, blue.200, white)" py={10}>
        {/* 로그인한 사용자 이름 표시 */}
        {user && (
          <Text fontSize="lg" fontWeight="medium" mb={2}>
            {user.name || user.loginId}님
          </Text>
        )}

        <Heading size="xl">느낌표와 함께 최고의 여행을 떠나보세요!</Heading>

        {/* '시작하기' 버튼 → /survey/date 경로로 이동 */}
        <Button colorScheme="blue" mt={4} onClick={() => navigate("/survey/date")}>
          시작하기
        </Button>

        <Box mt={6} display="flex" justifyContent="center">
          <TravelSearchFilter />
        </Box>
      </Box>

      {/* 콘텐츠 영역 - 핫한 여행지 & 최근 일정 */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} p={10}>
        {/* 여행지 카드 리스트 */}
        <GridItem colSpan={2}>
          <TravelCardList />
        </GridItem>

        {/* 최근 일정 */}
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
