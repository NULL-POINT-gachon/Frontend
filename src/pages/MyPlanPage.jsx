import React from "react";
import { Box, Heading, Button, VStack, HStack } from "@chakra-ui/react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const MyPlanPage = () => {
  const navigate = useNavigate();

  const goToPlan = (region) => {
    navigate(`/plan/${region}`);
  };

  return (
    <>
      <Header />
      <Box bgGradient="linear(to-b, blue.200, white)" py={10} textAlign="center" />
      <Box bg="gray.50" minH="100vh" p={6}>
        <HStack align="start" spacing={6}>
          <Box w="220px" bg="blue.100" p={4} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={4}>일정 관리</Heading>
            <VStack align="stretch" spacing={2}>
              <Button colorScheme="blue" onClick={() => goToPlan("namhae")}>남해 여행</Button>
              <Button colorScheme="blue" onClick={() => goToPlan("jindo")}>진도 여행</Button>
              <Button colorScheme="blue" onClick={() => goToPlan("jeju")}>제주도 여행</Button>
            </VStack>
          </Box>

          {/* 오른쪽 공간은 비워둠 */}
          <Box flex="1" />
        </HStack>
      </Box>
    </>
  );
};

export default MyPlanPage;
