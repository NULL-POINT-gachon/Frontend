// src/pages/AccountDeletePage.jsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input,
  FormControl,
  FormLabel,
  VStack
} from "@chakra-ui/react";
// import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AccountDeletePage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { logout, getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const cancelRef = React.useRef();

  // 탈퇴 확인 대화상자 열기
  const openConfirmDialog = () => {
    setIsOpen(true);
  };

  // 탈퇴 확인 대화상자 닫기
  const closeConfirmDialog = () => {
    setIsOpen(false);
    setConfirmText("");
  };

  // 실제 계정 삭제 처리
  const handleDelete = async () => {
    // "탈퇴합니다" 텍스트 확인
    if (confirmText !== "탈퇴합니다") {
      toast({
        title: "확인 텍스트가 일치하지 않습니다",
        description: '"탈퇴합니다"를 정확히 입력해주세요',
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = getToken();
      
      if (!token) {
        toast({
          title: "인증 오류",
          description: "로그인이 필요합니다",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
        return;
      }

      // 실제 회원 탈퇴 API 호출
      const response = await axios.patch("http://localhost:3000/user/deactivate", {
        headers: {
          Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
      });

      console.log("탈퇴 응답:", response.data);

      if (response.data.success) {
        // 성공 메시지 표시
        toast({
          title: "계정이 삭제되었습니다",
          description: "그동안 이용해주셔서 감사합니다",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // 로그아웃 처리 (AuthContext의 logout 함수 호출)
        logout();
        
        // 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        throw new Error(response.data.message || "탈퇴 처리 중 오류가 발생했습니다");
      }
    } catch (error) {
      console.error("계정 삭제 오류:", error);
      
      toast({
        title: "계정 삭제 실패",
        description: error.response?.data?.message || "서버와의 연결에 문제가 발생했습니다",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      closeConfirmDialog();
    }
  };

  return (
    <Box bg="white" minH="100vh">
      {/* <Header /> */}
      <Box bgGradient="linear(to-b, red.100, white)" py={10} textAlign="center">
        <Heading size="lg">계정 탈퇴</Heading>
      </Box>

      <Box maxW="800px" mx="auto" p={6}>
        <VStack spacing={6} align="start">
          <Text fontSize="lg" fontWeight="bold" color="red.500">
            계정 탈퇴 시 주의사항
          </Text>
          
          <Text fontSize="md" color="gray.700">
            탈퇴 시 다음 정보가 모두 삭제되며, 복구가 불가능합니다:
          </Text>
          
          <Box pl={4}>
            <Text>• 계정 정보 및 개인 설정</Text>
            <Text>• 저장된 모든 일정 및 데이터</Text>
            <Text>• 서비스 이용 기록</Text>
          </Box>
          
          <Text fontSize="md" color="gray.700" mt={4}>
            정말로 탈퇴를 원하시면 아래 버튼을 클릭해주세요.
          </Text>
          
          <Button 
            colorScheme="red" 
            onClick={openConfirmDialog}
            size="lg"
            mt={4}
          >
            계정 탈퇴하기
          </Button>
        </VStack>

        {/* 탈퇴 확인 대화상자 */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeConfirmDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                계정 탈퇴 확인
              </AlertDialogHeader>

              <AlertDialogBody>
                <Text mb={4}>
                  계정을 탈퇴하면 모든 데이터가 삭제되며 이 작업은 되돌릴 수 없습니다.
                </Text>
                <FormControl>
                  <FormLabel>확인을 위해 "탈퇴합니다"를 입력해주세요</FormLabel>
                  <Input 
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="탈퇴합니다"
                  />
                </FormControl>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeConfirmDialog}>
                  취소
                </Button>
                <Button 
                  colorScheme="red" 
                  onClick={handleDelete} 
                  ml={3}
                  isLoading={isLoading}
                  loadingText="처리중..."
                  isDisabled={confirmText !== "탈퇴합니다"}
                >
                  탈퇴 확인
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
};

export default AccountDeletePage;