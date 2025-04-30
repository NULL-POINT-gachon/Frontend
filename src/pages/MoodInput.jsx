// src/pages/MoodInput.jsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  Wrap,
  WrapItem,
  Button,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext";


const moods = ["설렘", "힐링", "감성", "여유", "활력", "모험", "로맨틱", "재충전"];

function MoodInput() {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const navigate = useNavigate();
  const { travelData, setTravelData } = useTravel();

  const toggleMood = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood]
    );
  };

  const handleSubmit = () => {
    setTravelData({ ...travelData, moods: selectedMoods });
    navigate("/summary");
  };

  return (
    <>
        <Box textAlign="center" py={10}>
          <Heading size="md" mb={6}>
            이번 여행에서 느끼고 싶은 감정은?
          </Heading>

          <Wrap justify="center" spacing={4}>
            {moods.map((mood) => (
              <WrapItem key={mood}>
                <Button
                  onClick={() => toggleMood(mood)}
                  variant={selectedMoods.includes(mood) ? "solid" : "outline"}
                  colorScheme="blue"
                >
                  {mood}
                </Button>
              </WrapItem>
            ))}
          </Wrap>

          {selectedMoods.length === 0 && (
            <Text mt={4} fontSize="sm" color="gray.500">
              감정을 선택해주세요.
            </Text>
          )}
        </Box>

      <Box mt={8} px={6} display="flex" justifyContent="space-between">
        <Button variant="outline" onClick={() => navigate("/survey/people")}>
          이전
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={selectedMoods.length === 0}
        >
          완료
        </Button>
      </Box>
    </>
  );
}

export default MoodInput;
