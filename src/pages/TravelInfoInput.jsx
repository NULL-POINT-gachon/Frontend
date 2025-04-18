import { Box, Button, Text } from "@chakra-ui/react";
import { useState } from "react";

import PeopleSelect from "../components/PeopleSelect";
import { useTravel } from "../contexts/TravelContext";
import { useNavigate } from "react-router-dom";

function TravelInfoInput() {
  const navigate = useNavigate();
  const { travelData, setTravelData } = useTravel();
  const [formData, setFormData] = useState({
    people: null,
    moods: [],
  });

  const { dateRange } = travelData;

  const handleNext = () => {
    setTravelData((prev) => ({
      ...prev,
      people: formData.people,
    }));
    navigate("/start/mood");
  };

  return (
    <Box p={6}>
      {/* 선택한 날짜 표시 */}
      {dateRange?.[0] && dateRange?.[1] && (
        <Text fontWeight="medium" mb={4} textAlign="center">
          선택한 날짜: {dateRange[0].toLocaleDateString()} ~ {dateRange[1].toLocaleDateString()}
        </Text>
      )}

      {/* 인원 선택 */}
      <PeopleSelect
        value={formData.people}
        onChange={(val) => setFormData({ ...formData, people: val })}
      />

      {/* 하단 버튼 */}
      <Box mt={8} display="flex" justifyContent="flex-end">
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
