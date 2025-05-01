import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Button,
  Spacer,
} from "@chakra-ui/react";
import {
  UserIcon,
  MapPinIcon,
  MessageSquareIcon,
  BrainIcon,
  SettingsIcon,
  LogOutIcon,
  CalendarIcon,
} from "lucide-react";
import { useContext } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AdminAuthContext);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* 좌측 사이드바 */}
      <Box
        w="240px"
        bg="white"
        p={6}
        borderRight="1px solid #e2e8f0"
        boxShadow="sm"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          {/* 로고 */}
          <Box
            mb={6}
            textAlign="center"
            cursor="pointer"
            onClick={() => navigate("/admin")}
          >
            <img
              src="/images/logo.png"
              alt="관리자 로고"
              style={{ width: "120px", margin: "0 auto" }}
            />
          </Box>

          {/* 메뉴 */}
          <VStack align="stretch" spacing={4}>
            <Button
              as={NavLink}
              to="users"
              variant="ghost"
              colorScheme="teal"
              justifyContent="start"
              leftIcon={<UserIcon size={16} />}
            >
              회원 관리
            </Button>
            <Button
              as={NavLink}
              to="places"
              variant="ghost"
              colorScheme="teal"
              justifyContent="start"
              leftIcon={<MapPinIcon size={16} />}
            >
              여행지 관리
            </Button>
            <Button
              as={NavLink}
              to="reviews"
              variant="ghost"
              colorScheme="teal"
              justifyContent="start"
              leftIcon={<MessageSquareIcon size={16} />}
            >
              리뷰 관리
            </Button>
            <Button
              as={NavLink}
              to="schedules"
              variant="ghost"
              colorScheme="teal"
              justifyContent="start"
              leftIcon={<CalendarIcon size={16} />}
            >
 일정 관리
 </Button>
<Button
  as={NavLink}
  to="ai"
  variant="ghost"
  colorScheme="teal"
  justifyContent="start"
  leftIcon={<BrainIcon size={16} />}
>
 

              AI 관리
            </Button>
            <Button
              as={NavLink}
              to="account"
              variant="ghost"
              colorScheme="teal"
              justifyContent="start"
              leftIcon={<SettingsIcon size={16} />}
            >
              계정 설정
            </Button>
          </VStack>
        </Box>

        {/* 로그아웃 버튼 */}
        <Box mt={8}>
          <Button
            onClick={handleLogout}
            variant="ghost"
            colorScheme="red"
            width="100%"
            justifyContent="start"
            leftIcon={<LogOutIcon size={16} />}
          >
            로그아웃
          </Button>
        </Box>
      </Box>

      {/* 오른쪽 콘텐츠 */}
      <Box flex="1" p={{ base: 6, md: 10 }}>
        <Outlet />
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
