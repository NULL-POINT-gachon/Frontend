import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import {
  Box, Input, Button, Text, VStack, Checkbox,
  InputGroup, InputRightElement, IconButton,
  Divider, Flex
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';

import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault(); // 🔥 폼 제출 기본 동작 방지
    setError('');

    if (!loginId.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }

    // 추후 백엔드 연동 예정
    console.log("입력 ID:", loginId);
    console.log("입력 PW:", password);
    login({ loginId });
    navigate("/", { replace: true });
  };

  const handleGoogleLogin = () => {
    console.log("⚠️ Google 로그인 API 연동 예정");
    alert('구글 로그인 기능은 추후 지원됩니다!');
  };

  return (
    <Flex align="center" justify="center" h="100vh" bg="gray.50">
      <Box w="400px" bg="white" p={8} boxShadow="md" borderRadius="lg">
        <form onSubmit={handleLogin}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">로그인</Text>

            <Text fontSize="sm">아이디</Text>
            <Input 
              placeholder="아이디 입력" 
              value={loginId} 
              onChange={(e) => setLoginId(e.target.value)}
              borderColor={error ? 'red.300' : 'gray.300'}
            />

            <Text fontSize="sm">비밀번호</Text>
            <InputGroup>
              <Input
                placeholder="비밀번호 입력"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderColor={error ? 'red.300' : 'gray.300'}
              />
              <InputRightElement>
                <IconButton 
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} 
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  aria-label="비밀번호 보기"
                />
              </InputRightElement>
            </InputGroup>

            {error && <Text color="red.500" fontSize="sm">{error}</Text>}

            <Checkbox>자동 로그인</Checkbox>

            <Button type="submit" colorScheme="blue" w="full">
              로그인
            </Button>

            <Divider />

            <Button w="full" leftIcon={<FcGoogle />} variant="outline" onClick={handleGoogleLogin}>
              구글로 시작하기
            </Button>

            <Button variant="link" colorScheme="blue" onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}

export default LoginPage;
