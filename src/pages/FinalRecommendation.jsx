import React from "react";
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Button,
    useToast,
    Spinner,
  } from "@chakra-ui/react";
  import { useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  import RecommendationCard from "../components/RecommendationCard";
  // import axios from "axios"; // 백엔드 연동 시 다시 주석 해제
  
  function FinalRecommendation() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const toast = useToast();
  
    useEffect(() => {
      const fetchPlaces = async () => {
        try {
          // 백엔드 연동 전: 더미 데이터 사용
          const dummyData = [
            {
              id: 1,
              title: "속초해수욕장",
              description:
                "수영, 산책, 조개껍질 수집을 즐길 수 있는 유명한 해변으로 뒤편에 소나무, 리조트, 식당이 늘어서 있습니다.",
              image: "/images/sokcho-beach.jpg",
              tags: ["힐링", "자연", "여유"],
            },
            {
              id: 2,
              title: "안목해변",
              description:
                "일출 명소이자 유명한 강릉 커피 거리에서 내려다보이는 긴 모래사장 해변입니다.",
              image: "/images/anmok-beach.webp",
              tags: ["감성", "바다", "맛집"],
            },
            {
              id: 3,
              title: "설악산 국립공원",
              description:
                "폭포가 있는 대규모 산악 국립공원으로 다양한 동식물이 있으며 하이킹을 즐길 수 있습니다.",
              image: "/images/seoraksan.jpg",
              tags: ["여유", "자연", "힐링"],
            },
          ];
  
          setPlaces(dummyData);
  
          // 백엔드 연동 시 아래 코드로 교체
          /*
          const res = await axios.get("/api/final-recommendation");
          setPlaces(res.data);
          */
        } catch (err) {
          console.error("AI 분석 실패:", err);
          setError("AI 분석 결과를 불러오지 못했습니다.");
          setPlaces([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPlaces();
    }, []);
  
    const handleRetry = () => {
      navigate("/preference");
    };
  
    return (
      <Box maxW="1000px" mx="auto" mt={10} p={6}>
        <Heading size="lg" textAlign="center" mb={6}>
          🎯 당신에게 어울리는 여행지를 추천합니다!
        </Heading>
  
        <Text fontSize="md" textAlign="center" mb={8}>
          AI 분석 결과: 당신은 감성을 중시하는 힐링 여행 타입이에요.
        </Text>
  
        {loading ? (
          <Box textAlign="center" mt={20}>
            <Spinner size="xl" color="blue.500" />
            <Text mt={4}>추천 결과를 불러오는 중입니다...</Text>
          </Box>
        ) : error ? (
          <Box textAlign="center" mt={20}>
            <Text fontSize="lg" color="red.500">
              {error}
            </Text>
            <Button mt={4} colorScheme="gray" onClick={() => navigate("/")}>
              홈으로 돌아가기
            </Button>
          </Box>
        ) : places.length === 0 ? (
          <Box textAlign="center" mt={20}>
            <Text fontSize="lg" mb={4}>
              추천된 장소가 없습니다.
            </Text>
            <Button colorScheme="gray" onClick={() => navigate("/")}>
              홈으로 돌아가기
            </Button>
          </Box>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={10}>
              {places.map((place) => (
                <RecommendationCard
                  key={place.id}
                  title={place.title}
                  description={place.description}
                  image={place.image}
                  tags={place.tags}
                  onClick={() => navigate(`/hot-destinations/${place.id}`)}
                />
              ))}
            </SimpleGrid>
  
            <Box textAlign="center">
              <Button colorScheme="blue" mr={4} onClick={handleRetry}>
                다시 분석하기
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={() =>
                  toast({
                    title: "공유 기능은 준비 중입니다",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                  })
                }
              >
                공유하기
              </Button>
            </Box>
          </>
        )}
      </Box>
    );
  }
  
  export default FinalRecommendation;
  