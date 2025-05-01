import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, Text, Button, Divider } from "@chakra-ui/react";
import { dummyNotices } from "./dummyNotices";

const AdminNoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notice = dummyNotices.find((n) => n.id === Number(id));

  if (!notice) {
    return (
      <Box p={6}>
        <Text color="red.500">해당 공지사항을 찾을 수 없습니다.</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="800px" mx="auto" bg="white" borderRadius="md" boxShadow="sm">
      <Heading size="lg" mb={2}>{notice.title}</Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>{notice.date}</Text>
      <Divider mb={6} />
      <Text whiteSpace="pre-line" mb={8}>{notice.content}</Text>
      <Button colorScheme="teal" onClick={() => navigate(`/admin/notices/${notice.id}/edit`)}>
        수정하기
      </Button>
    </Box>
  );
};

export default AdminNoticeDetail;