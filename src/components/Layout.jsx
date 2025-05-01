// components/Layout.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <Box bg="white" minHeight="100vh" bgGradient="linear(to-b, blue.100, white)">
      <Header />
      <Box maxW="800px" mx="auto" mt={10} px={4}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
