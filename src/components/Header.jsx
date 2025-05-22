import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  IconButton,
  Image,
  Text,
  Spacer,
  Input,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationDropdown from "../components/NotificationDropdown"; // 추가된 부분

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();

  return (
    <Flex justify="space-between" align="center" p={4} bg="white" boxShadow="sm">
      <HStack>
        <Image
          src="/images/logo.png"
          alt="Logo"
          cursor="pointer"
          onClick={() => navigate("/")}
          height="48px"
        />
      </HStack>

      <Spacer />

      <HStack spacing={4}>

        {/* 알림 드롭다운 삽입 */}
        <NotificationDropdown />

        {/* 로그인 상태 분기 */}
        {isLoggedIn ? (
          <>
            <Text fontWeight="medium">{username}님</Text>
            <Button colorScheme="red" onClick={logout}>로그아웃</Button>
          </>
        ) : (
          <Button colorScheme="blue" onClick={() => navigate("/login")}>로그인</Button>
        )}

        <IconButton
          icon={<FaUserCircle />}
          aria-label="사용자"
          fontSize="24px"
          onClick={() => navigate("/mypage")}
        />
      </HStack>
    </Flex>
  );
}

export default Header;
