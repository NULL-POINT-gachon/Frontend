import React, { useState, useEffect } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTravel } from "../contexts/TravelContext";
import axios from "axios";

function PreferenceSurvey() {
  const { token } = useAuth();
  const { travelData, setTravelData } = useTravel();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    activity: "",
    transport: "",
    intensity: 1,
    interests: [],
  });

  const [loading, setLoading] = useState(false);

  const ACTIVITY_ID = {
    "맛집 탐방": 1, "카페 투어": 3, "전시 관람": 5, "스파": 6, "쇼핑": 12,
    등산: 7, "해변 산책": 8, 액티비티: 9, "유적지 탐방": 10, 테마파크: 11
  };

  const MOOD_MAP = {
    설렘: 1, 힐링: 2, 감성: 3, 여유: 4,
    활력: 5, 모험: 6, 로맨틱: 7, 재충전: 8
  };

  useEffect(() => {
    console.log("moods in PreferenceSurvey:", travelData.moods);
  }, []);

  const buildRequestBody = () => {
    const rawMoods = Array.isArray(travelData.moods)
      ? travelData.moods
      : travelData.moods
        ? [travelData.moods]
        : [];

    const emotion_ids = rawMoods
      .map((m) => MOOD_MAP[m])
      .filter((id) => typeof id === "number");

      const activityName = formData.activity?.trim();
console.log("🔍 activityName:", activityName);
console.log("🔍 ACTIVITY_ID keys:", Object.keys(ACTIVITY_ID));
const activity_id = ACTIVITY_ID[activityName];
console.log("✅ activity_id:", activity_id);


    const payload = {
      city: "서울특별시",  // ✅ 테스트용 하드코딩
      activity_type: formData.type,
      activity_ids: Number.isInteger(activity_id) ? [activity_id] : [],
      emotion_ids: emotion_ids.length ? emotion_ids : [],
      preferred_transport: formData.transport,
      companion: travelData.people || 1,
      activity_level: formData.intensity,
    };

    console.log("✅ 선택된 감정들:", rawMoods);
    console.log("✅ emotion_ids:", emotion_ids);
    console.log("✅ formData.activity:", formData.activity);
    console.log("✅ activity_id:", activity_id);
    console.log("🚀 최종 전송 데이터:", payload);

    return payload;
  };

  const isValid =
    formData.type &&
    formData.activity &&
    formData.transport &&
    formData.intensity > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    const requestData = buildRequestBody();

    try {
      setTravelData(prev => ({ ...prev, preference: formData }));
      const res = await axios.post(
        "http://localhost:3000/trip/recommendation/preferences",
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/final-recommendation", { state: { places: res.data.data } });
    } catch (err) {
      console.error("서버 응답 에러:", err.response?.data || err.message);
      toast({ title: "추천 실패", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bgGradient="linear(to-b, blue.50, white)" minH="100vh" py={10}>
      <Box maxW="800px" mx="auto" p={8} bg="white" borderRadius="2xl" boxShadow="2xl">
        <Heading size="lg" mb={6} textAlign="center">✨ 여행 취향 상세 설문</Heading>

        {/* 여행 유형 */}
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

        {/* 활동 선택 */}
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

        {/* 이동수단 */}
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

        {/* 활동량 */}
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
