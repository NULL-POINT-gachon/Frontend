import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Wrap,
  WrapItem,
  RadioGroup,
  Radio,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTravel } from "../contexts/TravelContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";


function PreferenceSurvey() {
  const { token } = useAuth();
  const { travelData, setTravelData } = useTravel();
  const toast = useToast();

  useEffect(() => {
    console.log("moods in PreferenceSurvey:", travelData.moods);
  }, []);

  const [formData, setFormData] = useState({
    type: "",
    activity: "",
    transport: "",
    intensity: 1,
    interests: [], // 누락되지 않도록 유지
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /** 내부 선택 → AI 파라미터 매핑 */
  const ACTIVITY_ID = {
    "맛집 탐방": 1, "카페 투어": 3, "전시 관람": 5, "스파": 6, "쇼핑": 12,
    등산: 7, "해변 산책": 8, 액티비티: 9, "유적지 탐방": 10, 테마파크: 11
  };

  const MOOD_MAP = {
    설렘: 1, 힐링: 2, 감성: 3, 여유: 4,
    활력: 5, 모험: 6, 로맨틱: 7, 재충전: 8
  };
  
  const buildRequestBody = () => ({
    city: travelData.selectedCity || "서울특별시",
    activity_type: formData.type,                         // 실내/야외
    activity_ids:  [ACTIVITY_ID[formData.activity] || 1],
    emotion_ids:   travelData.moods.map(m => MOOD_MAP[m]).filter(Boolean) || [1],
    preffer_transport: formData.transport,
    companion:  travelData.people || 1,
    activity_level:    formData.intensity
  });
  

  const handleInterestToggle = (item) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== item)
          : [...prev.interests, item],
      };
    });
  };

  const isValid =
    formData.type &&
    formData.activity &&
    formData.transport &&
    formData.intensity > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      setTravelData(prev => ({ ...prev, preference: formData }));
      const res = await axios.post(
        "http://localhost:3000/trip/recommendation/preferences",
        buildRequestBody(),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 성공 시 추천 place 목록을 다음 페이지로 넘김
      navigate("/final-recommendation", { state: { places: res.data.data } });
    } catch (err) {
      toast({ title:"추천 실패", status:"error", duration:3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bgGradient="linear(to-b, blue.50, white)" minH="100vh" py={10}>
      <Box
        maxW="800px"
        mx="auto"
        p={8}
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
      >
        <Heading size="lg" mb={6} textAlign="center">
          ✨ 여행 취향 상세 설문
        </Heading>

        {/* 1. 여행 유형 */}
        <Box mb={6}>
          <Text fontSize="sm" color="gray.500">Q1</Text>
          <Text fontSize="lg" fontWeight="bold" mb={3}>선호하는 여행 유형</Text>
          <Wrap>
            {["실내", "야외"].map((item) => (
              <WrapItem key={item}>
                <Button
                  variant={formData.type === item ? "solid" : "outline"}
                  colorScheme="blue"
                  onClick={() => setFormData({ ...formData, type: item })}
                >
                  {item}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {/* 2. 활동 선택 */}
        <Box mb={6}>
          <Text fontSize="sm" color="gray.500">Q2</Text>
          <Text fontSize="lg" fontWeight="bold" mb={3}>활동 선택</Text>
          <Wrap>
            {(formData.type === "실내"
              ? ["맛집 탐방", "카페 투어", "전시 관람", "스파", "쇼핑"]
              : ["등산", "해변 산책", "액티비티", "유적지 탐방", "테마파크"]
            ).map((item) => (
              <WrapItem key={item}>
                <Button
                  variant={formData.activity === item ? "solid" : "outline"}
                  colorScheme="green"
                  onClick={() => setFormData({ ...formData, activity: item })}
                >
                  {item}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {/* 3. 이동수단 */}
        <Box mb={6}>
          <Text fontSize="sm" color="gray.500">Q3</Text>
          <Text fontSize="lg" fontWeight="bold" mb={3}>선호하는 이동수단</Text>
          <RadioGroup
            value={formData.transport}
            onChange={(val) => setFormData({ ...formData, transport: val })}
          >
            <Stack direction="row" spacing={5}>
              <Radio value="자가용">자동차</Radio>
              <Radio value="대중교통">대중교통</Radio>
              <Radio value="도보">도보</Radio>
            </Stack>
          </RadioGroup>
        </Box>

        {/* 4. 활동량 */}
        <Box mb={6}>
          <Text fontSize="sm" color="gray.500">Q4</Text>
          <Text fontSize="lg" fontWeight="bold" mb={3}>활동량 (1~10)</Text>
          <Slider
            defaultValue={formData.intensity}
            min={1}
            max={10}
            step={1}
            onChange={(val) => setFormData({ ...formData, intensity: val })}
          >
            <SliderTrack><SliderFilledTrack /></SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
          <Text mt={1} textAlign="right" fontSize="sm" color="gray.600">
            {formData.intensity} / 10
          </Text>
        </Box>

        {/* 제출 버튼 */}
        <Box mt={10} textAlign="center">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleSubmit}
            isDisabled={!isValid || loading}
          >
            {loading ? <Spinner size="sm" mr={2} /> : null}
            제출하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default PreferenceSurvey;
