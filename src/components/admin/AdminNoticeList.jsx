import React from "react";
import { useState } from "react";
import {
  Box, Button, Heading, Text, Flex, Spacer, VStack, useToast
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { dummyNotices } from "./dummyNotices";

const AdminNoticeList = () => {
  const [notices, setNotices] = useState(dummyNotices);
  const toast = useToast();

  const handleDelete = (id) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);

    toast({ title: "삭제 완료", status: "info" });
  };

  return (
    <Box p={6}>
      <Flex mb={4}>
        <Heading size="md">공지사항 관리</Heading>
        <Spacer />
        <Button as={Link} to="/admin/notices/new" colorScheme="teal">
          새 공지 작성
        </Button>
      </Flex>

      <VStack align="stretch" spacing={4}>
        {notices.length === 0 ? (
          <Text color="gray.500">공지사항이 없습니다.</Text>
        ) : (
          notices.map((notice) => (
            <Box key={notice.id} p={4} bg="white" borderRadius="md" boxShadow="sm">
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold">{notice.title}</Text>
                  <Text fontSize="sm" color="gray.500">{notice.date}</Text>
                </Box>
                <Box>
                  <Button
                    size="sm"
                    colorScheme="gray"
                    mr={2}
                    as={Link}
                    to={`/admin/notices/${notice.id}/edit`}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(notice.id)}
                  >
                    삭제
                  </Button>
                </Box>
              </Flex>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default AdminNoticeList;