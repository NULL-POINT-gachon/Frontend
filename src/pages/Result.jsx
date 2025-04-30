import React from "react";
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Button,
    Spinner,
  } from "@chakra-ui/react";
  import { useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  import RecommendationCard from "../components/RecommendationCard";
  import axios from "axios";
  
  function Result() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchRecommendations = async () => {
        try {
          // 실제 백엔드 연동 시 교체
          // const res = await axios.get("/api/recommendations");
          // setRecommendations(res.data);
  
          // 현재는 더미 데이터 사용
          const dummyData = [
            {
              title: "속초",
              description: "대한민국 강원특별자치도 동해안 북부에 위치한 시이다.",
              image: "/images/sokcho.png",
              tags: ["감성", "힐링", "자연"],
            },
            {
              title: "강릉",
              description: "바다와 카페의 도시, 여유로운 동해 여행.",
              image: "/images/gangneung.jpg",
              tags: ["감성", "바다", "카페"],
            },
            {
              title: "전주",
              description: "한옥과 전통이 살아있는 감성 도시.",
              image: "/images/jeonju.jpg",
              tags: ["전통", "감성", "힐링"],
            },
          ];
  
          setTimeout(() => {
            setRecommendations(dummyData);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error("추천 결과 로딩 실패:", error);
          setLoading(false);
        }
      };
  
      fetchRecommendations();
    }, []);
  
    const handleNext = async () => {
      try {
        // 실제 선택 결과 전송
        // await axios.post("/api/selected-city", { city: selectedCity });
        navigate("/survey/preference");
      } catch (error) {
        alert("도시 전송 실패");
      }
    };
  
    return (
      <Box maxW="1000px" mx="auto" mt={10} p={6}>
        <Heading size="lg" textAlign="center" mb={8}>
          🎉 AI가 당신의 여행 취향을 분석했어요!
        </Heading>
  
        {loading ? (
          <Box textAlign="center" mt={20}>
            <Spinner size="xl" color="blue.500" />
            <Text mt={4}>추천 결과를 불러오는 중입니다...</Text>
          </Box>
        ) : recommendations.length === 0 ? (
          <Box textAlign="center" mt={20}>
            <Text fontSize="lg" mb={4}>추천된 도시가 없습니다.</Text>
            <Button colorScheme="gray" onClick={() => navigate("/")}>홈으로 돌아가기</Button>
          </Box>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {recommendations.map((rec, idx) => (
                <RecommendationCard
                  key={idx}
                  {...rec}
                  isSelected={selectedCity === rec.title}
                  onClick={() => setSelectedCity(rec.title)}
                />
              ))}
            </SimpleGrid>
  
            <Box textAlign="center" mt={10}>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleNext}
                isDisabled={!selectedCity}
              >
                일정 추천 받기
              </Button>
            </Box>
          </>
        )}
  
        <Box textAlign="center" mt={6}>
          <Button variant="link" colorScheme="gray" onClick={() => navigate("/survey/date")}>
            ⬅️ 다시 분석하기
          </Button>
        </Box>
      </Box>
    );
  }
  
  export default Result;
  