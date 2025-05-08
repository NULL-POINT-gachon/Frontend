// src/pages/MyPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUserCog, FaInfoCircle } from "react-icons/fa";
// Header 임포트 제거

const MyPage = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");

  const sections = [
    {
      title: "개인정보 관리",
      description: "이름, 연락처 등 개인정보 확인 및 수정",
      icon: FaUserCog,
      path: "/mypage/profile",
    },
    {
      title: "계정 탈퇴",
      description: "계정 삭제를 원하신다면 여기에서 처리할 수 있어요.",
      icon: FaInfoCircle,
      path: "/mypage/delete",
    },
  ];

  return (
    <Box bg="white" minH="100vh">
      {/* Header 컴포넌트 제거 */}

      <Box bgGradient="linear(to-b, blue.100, white)" py={10} textAlign="center">
        <Heading size="lg">마이페이지</Heading>
      </Box>

      <Box maxW="800px" mx="auto" p={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {sections.map((section, idx) => (
            <Box
              key={idx}
              bg={cardBg}
              p={5}
              borderRadius="lg"
              shadow="md"
              _hover={{ shadow: "lg", cursor: "pointer" }}
              onClick={() => navigate(section.path)}
            >
              <Icon as={section.icon} boxSize={6} color="blue.500" mb={3} />
              <Text fontWeight="bold" fontSize="lg" mb={1}>
                {section.title}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {section.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default MyPage;