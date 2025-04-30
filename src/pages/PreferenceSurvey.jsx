import React from "react";
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
    Alert,
    AlertIcon,
    Tag,
    TagLabel,
    Spinner,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  
  function PreferenceSurvey() {
    const [formData, setFormData] = useState({
      type: "",
      activity: "",
      transport: "",
      intensity: 1 // 기본값 1로 변경,
    });
  
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
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
      try {
        setLoading(true);
        setError("");
  
        await axios.post("/api/survey-detail", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        navigate("/final-recommendation");
      } catch (err) {
        const message =
          err?.response?.data?.message || "설문 저장에 실패했습니다.";
        setError(message);
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
                <Radio value="자동차">자동차</Radio>
                <Radio value="기차">기차</Radio>
                <Radio value="버스">버스</Radio>
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
  


  
          {/* 에러 메시지 */}
          {error && (
            <Alert status="error" mt={4} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
  
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
  