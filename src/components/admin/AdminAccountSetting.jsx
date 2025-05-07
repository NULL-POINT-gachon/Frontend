import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Switch,
  HStack,
} from "@chakra-ui/react";

const AdminAccountSetting = () => {
  const [adminInfo] = useState({
    name: "관리자",
    email: "admin@example.com",
    lastLogin: "2025-03-30 13:42",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const toast = useToast();

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "모든 항목을 입력해주세요.", status: "warning", duration: 2000, isClosable: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "새 비밀번호가 일치하지 않습니다.", status: "error", duration: 2000, isClosable: true });
      return;
    }
    toast({ title: "비밀번호가 변경되었습니다.", status: "success", duration: 2000, isClosable: true });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEmailChange = () => {
    if (!newEmail) {
      toast({ title: "새 이메일을 입력해주세요.", status: "warning", duration: 2000, isClosable: true });
      return;
    }
    toast({ title: "이메일이 변경되었습니다.", status: "success", duration: 2000, isClosable: true });
    setNewEmail("");
  };

  const toggle2FA = () => {
    setIs2FAEnabled((prev) => !prev);
    toast({
      title: is2FAEnabled ? "2단계 인증이 비활성화되었습니다." : "2단계 인증이 활성화되었습니다.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      p={8}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
    >
      <Heading size="md" mb={6}>
        계정 설정
      </Heading>

      <VStack spacing={4} align="stretch">
        <FormControl isReadOnly>
          <FormLabel>이름</FormLabel>
          <Input value={adminInfo.name} isReadOnly />
        </FormControl>

        <FormControl isReadOnly>
          <FormLabel>현재 이메일</FormLabel>
          <Input value={adminInfo.email} isReadOnly />
        </FormControl>

        <FormControl>
          <FormLabel>새 이메일 주소</FormLabel>
          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="새 이메일 입력"
          />
        </FormControl>
        <Button colorScheme="teal" onClick={handleEmailChange}>
          이메일 변경
        </Button>

        <FormControl isReadOnly>
          <FormLabel>마지막 로그인</FormLabel>
          <Input value={adminInfo.lastLogin} isReadOnly />
        </FormControl>

        <HStack mt={4} align="center">
          <FormLabel mb="0">2단계 인증 활성화</FormLabel>
          <Switch isChecked={is2FAEnabled} onChange={toggle2FA} />
        </HStack>

        <Heading size="sm" mt={6}>
          비밀번호 변경
        </Heading>

        <FormControl>
          <FormLabel>현재 비밀번호</FormLabel>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>새 비밀번호</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>새 비밀번호 확인</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="teal" onClick={handlePasswordChange}>
          비밀번호 변경
        </Button>
      </VStack>
    </Box>
  );
};

export default AdminAccountSetting;
