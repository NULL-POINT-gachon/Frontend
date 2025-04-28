import React from "react";
import {
    Box,
    Flex,
    HStack,
    Button,
    IconButton,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Divider,
    Spacer,
    Input,
  } from "@chakra-ui/react";
  import { FaUserCircle, FaBell } from "react-icons/fa";
  import { SearchIcon } from "@chakra-ui/icons";
  import { useNavigate } from "react-router-dom";
  // import { useAuth } from "../contexts/AuthContext"; // 주석 처리
  
  function Header() {
    const navigate = useNavigate();
    // const { isLoggedIn, username, logout } = useAuth(); // 주석 처리
  
    const dummyNotifications = [
      { id: 1, message: "홍길동님이 여행 일정을 공유했습니다." },
      { id: 2, message: "속초 여행 일정이 수정되었습니다." },
      { id: 3, message: "강릉 일정에 새로운 댓글이 달렸습니다." },
    ];
  
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
          <Input placeholder="여행지를 검색하세요" w="200px" />
          <IconButton icon={<SearchIcon />} aria-label="검색" />
  
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaBell />}
              aria-label="알림"
              fontSize="20px"
            />
            <MenuList minW="250px">
              <Box px={3} py={2}>
                <Text fontWeight="bold">🔔 최근 알림</Text>
              </Box>
              <Divider />
              {dummyNotifications.map((noti) => (
                <MenuItem key={noti.id}>{noti.message}</MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={() => navigate("/notifications")} color="blue.500">
                전체 알림 보기 →
              </MenuItem>
            </MenuList>
          </Menu>
  
          {/* 로그인 버튼만 임시 표시 */}
          <Button colorScheme="blue" onClick={() => navigate("/login")}>로그인</Button>
  
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
  