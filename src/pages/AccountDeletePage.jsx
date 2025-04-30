// src/pages/AccountDeletePage.jsx
import React from "react";
import { Box, Heading, Text, Button, useToast } from "@chakra-ui/react";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AccountDeletePage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // 실제 API 엔드포인트로 바꿔주세요
      await axios.delete("/api/user/delete");

      toast({
        title: "계정이 삭제되었습니다.",
        description: "그동안 이용해주셔서 감사합니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // 삭제 후 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      toast({
        title: "계정 삭제 실패",
        description: "서버와의 연결에 문제가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" minH="100vh">
      <Header />
      <Box bgGradient="linear(to-b, red.100, white)" py={10} textAlign="center">
        <Heading size="lg">계정 탈퇴</Heading>
      </Box>

      <Box maxW="800px" mx="auto" p={6}>
        <Text fontSize="md" color="gray.600" mb={4}>
          정말로 계정을 삭제하시겠어요? 탈퇴 시 모든 일정과 데이터가 삭제됩니다.
        </Text>
        <Button colorScheme="red" onClick={handleDelete}>
          계정 탈퇴하기
        </Button>
      </Box>
    </Box>
  );
};

export default AccountDeletePage;
