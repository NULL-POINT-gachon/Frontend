import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import {
  Box, Input, Button, Text, VStack, Checkbox,
  InputGroup, InputRightElement, IconButton,
  Divider, Flex, Spinner
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!loginId.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력하세요.');
      setIsLoading(false);
      return;
    }

    try {
      // 백엔드 API로 로그인 요청
      const result = await loginWithCredentials(loginId, password);
      
      if (result.success) {
        console.log("로그인 성공!");
        navigate("/", { replace: true });
      } else {
        setError(result.error || '로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error("로그인 처리 중 오류:", error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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

            <Text fontSize="sm">이메일</Text>
            <Input 
              placeholder="이메일 입력" 
              value={loginId} 
              onChange={(e) => setLoginId(e.target.value)}
              borderColor={error ? 'red.300' : 'gray.300'}
              type="email"
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

            <Button 
              type="submit" 
              colorScheme="blue" 
              w="full"
              isLoading={isLoading}
              loadingText="로그인 중..."
            >
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