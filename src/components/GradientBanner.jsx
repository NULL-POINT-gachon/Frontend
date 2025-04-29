// src/components/GradientBanner.jsx
import React from "react";
import { Box } from "@chakra-ui/react";

function GradientBanner({ children }) {
  return (
    <Box
      w="100%" // 너비 전체
      textAlign="center"
      bgGradient="linear(to-b, blue.200, white)"
      py={10}
      minHeight="250px"
      
    >
      {children}
    </Box>
  );
}

export default GradientBanner;
