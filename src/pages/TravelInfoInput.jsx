import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext";
import PeopleSelect from "../components/PeopleSelect";

function TravelInfoInput() {
  const navigate = useNavigate();
  const { travelData, setTravelData } = useTravel();
  const [formData, setFormData] = useState({
    people: travelData.people || null,
  });

  const handleNext = () => {
    setTravelData((prev) => ({
      ...prev,
      people: formData.people,
    }));
    navigate("/start/mood");
  };

  const handleBack = () => {
    navigate("/survey/date");
  };

  return (
    <Box p={6}>
      {travelData.dateRange?.[0] && travelData.dateRange?.[1] && (
        <Text fontWeight="medium" mb={4} textAlign="center">
          선택한 날짜: {travelData.dateRange[0].toLocaleDateString()} ~{" "}
          {travelData.dateRange[1].toLocaleDateString()}
        </Text>
      )}

      <PeopleSelect
        value={formData.people}
        onChange={(val) => setFormData({ ...formData, people: val })}
      />

      <Box mt={8} display="flex" justifyContent="space-between">
        <Button onClick={handleBack}>이전</Button>
        <Button
          colorScheme="blue"
          onClick={handleNext}
          isDisabled={!formData.people}
        >
          무드 입력으로 이동
        </Button>
      </Box>
    </Box>
  );
}

export default TravelInfoInput;
