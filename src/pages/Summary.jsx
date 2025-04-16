import { useState } from "react";
import { Box, Heading, VStack, Text, Button, HStack, Tag, Alert, AlertIcon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext";

function Summary() {
  const navigate = useNavigate();
  const { travelData } = useTravel();
  const { dateRange, people, moods } = travelData;
  const [error, setError] = useState(null); // 에러 상태 추가

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "날짜 미선택";

  const handleSubmit = async () => {
    try {
      setError(null); // 기존 오류 초기화
      // TODO: 실제 서버 요청 코드로 대체 예정
      throw new Error("서버 오류 발생"); // 임시 실패 시뮬레이션
      // 성공 시 navigate("/start/result")
    } catch (err) {
      setError("제출 실패: 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Box p={6} maxW="600px" mx="auto" textAlign="center">
      <Heading size="md" mb={6}>여행 설문 요약</Heading>

      <VStack spacing={4} align="start" p={4} borderWidth={1} borderRadius="lg">
        <Text><strong>날짜:</strong> {formatDate(dateRange?.[0])} ~ {formatDate(dateRange?.[1])}</Text>
        <Text><strong>인원:</strong> {people || "미선택"}</Text>
        <Box>
          <Text mb={1}><strong>감정:</strong></Text>
          <HStack spacing={2} wrap="wrap">
            {moods?.length > 0 ? moods.map((mood) => (
              <Tag key={mood} colorScheme="blue">{mood}</Tag>
            )) : <Text>미선택</Text>}
          </HStack>
        </Box>
      </VStack>

      {/* 에러 메시지 출력 */}
      {error && (
        <Alert status="error" mt={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <HStack mt={8} spacing={4} justify="center">
        <Button colorScheme="blue" onClick={handleSubmit}>AI 분석 결과 보기</Button>
        <Button variant="outline" onClick={() => navigate("/")}>다시 작성하기</Button>
      </HStack>
    </Box>
  );
}

export default Summary;
