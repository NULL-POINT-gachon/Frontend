// src/components/mypage/InfoRow.jsx
import React from "react";
import { Flex, Text } from "@chakra-ui/react";

const InfoRow = ({ label, value }) => (
  <Flex justify="space-between" bg="white" p={3} rounded="md" shadow="sm">
    <Text fontWeight="medium">{label}</Text>
    <Text color="gray.600">{value}</Text>
  </Flex>
);

export default InfoRow;
