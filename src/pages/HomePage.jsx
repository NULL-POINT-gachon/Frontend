import React, { useState } from "react";
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
import TravelSearchFilter from "../components/TravelSearchFilter";
import TravelCardList from "../components/TravelCardList";
import DateFilterDropdown from "../components/DateFilterDropdown";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTravel } from "../contexts/TravelContext";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { travelData } = useTravel();
  const dateRange = travelData.dateRange || [null, null];

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

      {/* 메인 배너 */}
      <Box textAlign="center" bgGradient="linear(to-b, blue.200, white)" py={10}>
        {user && (
          <Text fontSize="lg" fontWeight="medium" mb={2}>
            {user.name || user.loginId}님
          </Text>
        )}
        <Heading size="xl">느낌표와 함께 최고의 여행을 떠나보세요!</Heading>

        {/* 시작하기 버튼 (설문 직접 진입) */}
        <Button colorScheme="blue" mt={4} onClick={() => navigate("/survey/people")}>
          시작하기
        </Button>

        {/* 날짜 선택 드롭다운 + 검색 아이콘 */}
        <HStack mt={4} justify="center">
          <DateFilterDropdown />
          <IconButton
            icon={<SearchIcon />}
            colorScheme="blue"
            aria-label="검색"
            onClick={handleSearch}
          />
        </HStack>

        {/* 여행지 키워드 필터 */}
        <Box mt={6} display="flex" justifyContent="center">
          <TravelSearchFilter />
        </Box>
      </Box>

      {/* 콘텐츠 영역 */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} p={10}>
        <GridItem colSpan={2}>
          <TravelCardList />
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
