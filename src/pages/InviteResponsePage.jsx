// src/pages/InviteResponsePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Button, Text, Spinner, VStack, useToast, Heading, HStack
} from "@chakra-ui/react";
import axios from "axios";
import Header from "../components/Header";

const InviteResponsePage = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [inviteInfo, setInviteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/trip/share/${shareId}`);
        setInviteInfo(res.data);
      } catch (err) {
        toast({ title: "초대 정보를 불러오지 못했습니다.", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [shareId]);

  const handleAccept = async () => {
    try {
      await axios.post(`http://localhost:3000/trip/share/accept/${shareId}`);
      toast({ title: "일정이 내 일정에 추가되었습니다.", status: "success" });
      navigate("/mypage");
    } catch {
      toast({ title: "수락 처리 중 오류가 발생했습니다.", status: "error" });
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`http://localhost:3000/trip/share/reject/${shareId}`);
      toast({ title: "초대를 거절했습니다.", status: "info" });
      navigate("/");
    } catch {
      toast({ title: "거절 처리 중 오류가 발생했습니다.", status: "error" });
    }
  };

  if (loading) {
    return <Box p={10}><Spinner /> 불러오는 중...</Box>;
  }

  if (!inviteInfo) {
    return <Box p={10}><Text>초대 정보를 찾을 수 없습니다.</Text></Box>;
  }

  return (
    <>
      <Header />
      <Box bgGradient="linear(to-b, green.100, white)" py={10} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">여행 일정 초대</Text>
      </Box>

      <Box maxW="xl" mx="auto" p={6} bg="white" mt={6} borderRadius="md" boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Text><b>{inviteInfo.senderName}</b> 님이 아래 여행 일정을 공유했습니다.</Text>

          <Box bg="gray.50" p={4} borderRadius="md">
            <Heading size="sm" mb={1}>{inviteInfo.planTitle}</Heading>
            <Text fontSize="sm" color="gray.600">{inviteInfo.dateRange}</Text>
            <Text fontSize="sm" mt={1}>지역: {inviteInfo.region}</Text>
            <Text fontSize="sm">참가자: {inviteInfo.participants?.join(", ")}</Text>
          </Box>

          <HStack justify="center" pt={4} spacing={4}>
            <Button colorScheme="blue" onClick={handleAccept} w="40%">✅ 수락하기</Button>
            <Button variant="outline" colorScheme="red" onClick={handleReject} w="40%">❌ 거절하기</Button>
          </HStack>
        </VStack>
      </Box>
    </>
  );
};

export default InviteResponsePage;
