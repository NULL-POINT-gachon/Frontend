import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Heading, Text, VStack, Input, Button, HStack, Badge
} from "@chakra-ui/react";
import { dummyQnaList } from "./dummyQna";

const AdminQnaList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredQnaList = dummyQnaList.filter((qna) => {
    const matchesSearch =
      qna.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qna.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" || (filter === "answered" && qna.answered) || (filter === "unanswered" && !qna.answered);
    return matchesSearch && matchesFilter;
  });

  return (
    <Box p={6}>
      <Heading size="md" mb={4}>Q&A 관리</Heading>

      <Input
        placeholder="검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />

      <HStack spacing={4} mb={6}>
        <Button onClick={() => setFilter("all")}>전체</Button>
        <Button onClick={() => setFilter("answered")}>답변 완료</Button>
        <Button onClick={() => setFilter("unanswered")}>미답변</Button>
      </HStack>

      <VStack align="stretch" spacing={4}>
        {filteredQnaList.map((qna) => (
          <Box
            key={qna.id}
            p={4}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
          >
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="bold">{qna.question}</Text>
                <Text fontSize="sm" color="gray.500">{qna.date}</Text>
                <Text fontSize="sm" color="gray.600">작성자: {qna.user}</Text>
              </Box>
              <HStack>
                <Badge colorScheme={qna.answered ? "green" : "red"}>
                  {qna.answered ? "답변 완료" : "미답변"}
                </Badge>
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => navigate(`/admin/qna/${qna.id}`)}
                >
                  보기
                </Button>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default AdminQnaList;