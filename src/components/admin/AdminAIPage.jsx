import React, { useState } from "react";
import {
  Box,
  Heading,
  Button,
  Select,
  Input,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";

const AdminAIPage = () => {
  const toast = useToast();
  const [version, setVersion] = useState("v1");
  const [param1, setParam1] = useState("101");
  const [param2, setParam2] = useState("0.5");

  const showToast = (title, status = "success") => {
    toast({
      title,
      status,
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        AI 여행지 추천 관리
      </Heading>

      {/* 1. 추천 학습 및 검증 */}
      <Box p={5} mb={6} borderWidth={1} borderRadius="md" bg="white">
        <Heading size="sm" mb={4}>1. 추천 학습 및 검증</Heading>
        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={() => showToast("모델 학습 요청이 전송되었습니다.")}>
            모델 학습
          </Button>
          <Button colorScheme="green" onClick={() => showToast("모델 검증 요청이 전송되었습니다.")}>
            모델 검증
          </Button>
        </HStack>
      </Box>

      {/* 2. 추천 배포 */}
      <Box p={5} mb={6} borderWidth={1} borderRadius="md" bg="white">
        <Heading size="sm" mb={4}>2. 추천 배포</Heading>
        <HStack spacing={4}>
          <Button colorScheme="purple" onClick={() => showToast("모델 배포 요청이 전송되었습니다.")}>
            모델 배포
          </Button>
          <Select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            w="120px"
          >
            <option value="v1">v1</option>
            <option value="v2">v2</option>
            <option value="v3">v3</option>
          </Select>
          <Button onClick={() => showToast(`버전 ${version}이 설정되었습니다.`)}>
            버전 설정
          </Button>
        </HStack>
      </Box>

      {/* 3. 모델 버전 및 파라미터 관리 */}
      <Box p={5} mb={6} borderWidth={1} borderRadius="md" bg="white">
        <Heading size="sm" mb={4}>3. 모델 버전 및 파라미터 관리</Heading>
        <HStack spacing={4}>
          <Input
            value={param1}
            onChange={(e) => setParam1(e.target.value)}
            w="100px"
            placeholder="파라미터 1"
          />
          <Input
            value={param2}
            onChange={(e) => setParam2(e.target.value)}
            w="100px"
            placeholder="파라미터 2"
          />
          <Button colorScheme="orange" onClick={() => showToast("파라미터가 저장되었습니다.")}>
            파라미터 저장
          </Button>
        </HStack>
      </Box>

      {/* 4. 장애 기록 */}
      <Box p={5} borderWidth={1} borderRadius="md" bg="white">
        <Heading size="sm" mb={4}>4. 장애 기록</Heading>
        <Button colorScheme="red" onClick={() => showToast("장애 등록 요청이 전송되었습니다.")}>
          장애 등록
        </Button>
      </Box>
    </Box>
  );
};

export default AdminAIPage;
