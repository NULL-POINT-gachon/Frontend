import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Heading, Text, Textarea, Button,
  VStack, HStack, Badge
} from "@chakra-ui/react";
import { dummyQnaList } from "./dummyQna";

const AdminQnaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qna = dummyQnaList.find((q) => q.id === parseInt(id));

  const [answer, setAnswer] = useState(qna?.answer || "");

  if (!qna) {
    return <Text color="red.500">Q&A를 찾을 수 없습니다.</Text>;
  }

  const handleSaveAnswer = () => {
    console.log("답변 저장:", answer);
    qna.answer = answer;
    qna.answered = true;
    navigate("/admin/qna");
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>Q&A 상세</Heading>

      <Box mb={6}>
        <Heading size="md" mb={2}>{qna.question}</Heading>
        <Text fontSize="sm" color="gray.500">{qna.date}</Text>
        <Text fontSize="sm" color="gray.600" mt={1}>작성자: {qna.user}</Text>
        <Text mt={4}>{qna.content}</Text>
      </Box>

      <VStack align="stretch" spacing={4}>
        <HStack>
          <Text>답변 상태:</Text>
          <Badge colorScheme={qna.answered ? "green" : "red"}>
            {qna.answered ? "답변 완료" : "미답변"}
          </Badge>
        </HStack>

        <Text fontWeight="bold">답변:</Text>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 작성하세요."
          size="md"
        />
        <Button
          colorScheme="teal"
          onClick={handleSaveAnswer}
          disabled={!answer.trim()}
        >
          저장
        </Button>
      </VStack>
    </Box>
  );
};

export default AdminQnaDetail;
