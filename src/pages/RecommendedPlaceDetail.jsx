import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Badge,
  Wrap,
  WrapItem,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext";
// import axios from "axios"; // 연동 시 활성화

function HotDestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { travelData } = useTravel();
  const { state }     = useLocation();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state?.place) {
      setPlace(state.place);
      setLoading(false);
      return;
    }

  }, [id, toast]);

  const MOOD_MAP = {
    설렘: 1, 힐링: 2, 감성: 3, 여유: 4,
    활력: 5, 모험: 6, 로맨틱: 7, 재충전: 8
  };

  const handleCreatePlan = async () => {
    try {
      /* ---------- 1. 필요 데이터 꺼내기 ---------- */
      const { selectedCity, people, moods, tripDuration, preference } = travelData;
  
      // 활동 ID 매핑 (예시)
      const ACTIVITY_ID = {
        "맛집 탐방": 1, "카페 투어": 3, "전시 관람": 5, "스파": 6, "쇼핑": 12,
        등산: 7, "해변 산책": 8, 액티비티: 9, "유적지 탐방": 10, 테마파크: 11
      };
  
      // 감정 ID는 이미 그대로 저장돼 있다고 가정 (빈 배열이면 1 기본)
      const Mood_Map = {
        설렘: 1, 힐링: 2, 감성: 3, 여유: 4,
        활력: 5, 모험: 6, 로맨틱: 7, 재충전: 8
      }
  
      /* ---------- 2. POST ---------- */
      const res = await fetch("http://localhost:3000/trip/recommendation/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          /* 백엔드 필드명 기준 -------- */
          city:               selectedCity,
          activity_type:      preference.type,                            // "실내" / "야외"
          activity_ids:       [ACTIVITY_ID[preference.activity] || 1],    // 한 개만 예시
          emotion_ids:        travelData.moods.map(m => MOOD_MAP[m]).filter(Boolean) || [1],
          preferred_transport:  preference.transport,                       // 스펠링 주의
          companion:   people || 1,
          activity_level:     preference.intensity,
          place_name:         place.title,
          trip_duration:      tripDuration || 3,
          trip_id:            travelData.tripId,
          visit_date:         travelData.dateRange[0],
          departure_date:     travelData.dateRange[1]
        }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        navigate("/plan", { state: { plan: result.data } });
      } else {
        toast({
          title: result.message || "추천 실패",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "일정 추천 요청 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" color="blue.500" />
        <Text mt={4}>장소 정보를 불러오는 중입니다...</Text>
      </Box>
    );
  }

  if (!place) {
    return (
      <Box textAlign="center" mt={20}>
        <Text fontSize="lg">장소 정보를 찾을 수 없습니다.</Text>
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" mt={10} p={4}>
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        {place.title}
      </Text>
      <Image src={place.image} alt={place.title} borderRadius="md" mb={4} />
      <Text mb={4}>{place.description}</Text>
      <Wrap mb={6}>
        {place.tags.map((tag, idx) => (
          <WrapItem key={idx}>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="md">
              #{tag}
            </Badge>
          </WrapItem>
        ))}
      </Wrap>

      <Button colorScheme="blue" onClick={handleCreatePlan}>
        이 장소로 일정 만들기
      </Button>
    </Box>
  );
}

export default HotDestinationDetail;
