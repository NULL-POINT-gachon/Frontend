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
// import axios from "axios"; // 연동 시 활성화

const dummyPlaces = [
  {
    id: "1",
    title: "속초해수욕장",
    description: "수영, 산책, 조개껍질 수집을 즐길 수 있는 유명한 해변입니다.",
    image: "/images/sokcho-beach.jpg",
    tags: ["힐링", "자연", "여유"],
    region: "sokcho",
  },
  {
    id: "2",
    title: "안목해변",
    description:"일출 명소이자 유명한 강릉 커피 거리에서 내려다보이는 긴 모래사장 해변입니다.",
    image: "/images/anmok-beach.webp",
    tags: ["감성", "바다", "맛집"],
  },
  {
    id: "3",
    title: "설악산 국립공원",
    description:"폭포가 있는 대규모 산악 국립공원으로 다양한 동식물이 있으며 하이킹을 즐길 수 있습니다.",
    image: "/images/seoraksan.jpg",
    tags: ["여유", "자연", "힐링"],
  },
];

function HotDestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        // 실제 백엔드 연동 시 사용:
        // const res = await axios.get(`/api/hot-destinations/${id}`);
        // setPlace(res.data);

        const found = dummyPlaces.find((p) => p.id === id);
        setPlace(found);
      } catch (err) {
        toast({
          title: "장소 정보를 불러오지 못했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id, toast]);

  const handleCreatePlan = async () => {
    if (!place?.region) return;
  
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch("http://localhost:3000/trip/recommendation/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NjU0OTM5MywiZXhwIjoxNzQ2NjM1NzkzfQ.580xtln5-5PJ3sJ5c_hU01TfatGhRDJw61F2_B5u-bo`,
        },
        body: JSON.stringify({
          city: "서울특별시", // 예시: 실제로는 place.region -> '서울'이면 매핑 필요
          activity_type: "실내",
          activity_ids: [1, 3, 5],
          emotion_ids: [2, 3],
          preferredTransport: "대중교통",
          companion: 2,
          activity_level: 5,
          place_name: place.title,
          trip_duration: 3
        })
      });
  
      const result = await res.json();
      if (res.ok) {
        navigate("/plan", { state: { plan: result.data } });
      } else {
        toast({ title: result.message || "추천 실패", status: "error", duration: 3000 });
      }
  
    } catch (err) {
      toast({ title: "일정 추천 요청 실패", status: "error", duration: 3000 });
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
