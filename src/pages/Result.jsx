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
  import { useAuth } from "../contexts/AuthContext";
  import { useTravel } from "../contexts/TravelContext";
  import axios from "axios";
  
  function Result() {
    const { token }   = useAuth();
    const { travelData } = useTravel();   // dateRange, people, moods
    const navigate = useNavigate();
    const { setTravelData } = useTravel();

    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState(null);

    // ① 무드 → emotion_id 매핑표
    const MOOD_MAP = {
      설렘: 1, 힐링: 2, 감성: 3, 여유: 4,
      활력: 5, 모험: 6, 로맨틱: 7, 재충전: 8
    };
  
    useEffect(() => {
      const fetchRecommendations = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
    
          const body = {
            start_date:  travelData.dateRange[0],
            end_date:    travelData.dateRange[1],
            companions_count: travelData.people,
            emotion_ids: travelData.moods.map(m => MOOD_MAP[m]).filter(Boolean)
          };
    
          const res = await axios.post(
            "http://localhost:3000/trip/recommendation/city",
            body,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("res", res);
    
          const list = res.data.data.recommendations || [];
          const tripId = res.data.data.trip_id;
          console.log("tripId", tripId);
          setTravelData(prev => ({ ...prev, tripId }));
          console.log("list", list);
          setRecommendations(list);
        } catch (err) {
          console.error("추천 결과 로딩 실패:", err.response?.data || err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchRecommendations();
    }, []);
  
    
    const handleNext = () => {
      if (!selectedCity) return;

      setTravelData(prev => ({ ...prev, selectedCity }));
      navigate("/preference");
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
                title={rec.title}
                description={rec.description}
                image={rec.image}
                tags={rec.tags}
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
          <Button variant="link" colorScheme="gray" onClick={() => navigate("/")}>
            ⬅️ 다시 분석하기
          </Button>
        </Box>
      </Box>
    );
  }
  
  export default Result;
  