import React from "react";
import { Box, Heading } from "@chakra-ui/react";

export default function BlankPanel() {
    return (
      <Box bg="white" p={10} textAlign="center" borderRadius="md" boxShadow="md">
        <Heading size="md">왼쪽에서 일정을 선택하세요!</Heading>
      </Box>
    );
  }
  