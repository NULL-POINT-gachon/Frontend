import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Input, Button, Text, VStack, Select,
  FormControl, FormLabel, FormErrorMessage, Flex
} from '@chakra-ui/react';
import { useAuth } from "../contexts/AuthContext";

function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    residence: ""
  });
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { completeProfile } = useAuth();

  useEffect(() => {
    // URL에서 토큰 파라미터 추출
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('인증 정보가 없습니다. 다시 로그인해주세요.');
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { age, gender, residence } = formData;
    
    // 입력 검증
    if (!age || !gender || !residence) {
      setError("모든 필드를 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      // 프로필 완성 API 호출
      const result = await completeProfile({
        token,
        age: parseInt(age),
        gender,
        residence
      });
      
      if (result.success) {
        alert("회원가입이 완료되었습니다!");
        navigate("/", { replace: true });
      } else {
        setError(result.error || '프로필 정보 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error("프로필 저장 오류:", error);
      setError('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" h="100vh" bg="gray.50">
      <Box w="400px" bg="white" p={8} boxShadow="md" borderRadius="lg">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">추가 정보 입력</Text>
            <Text textAlign="center" color="gray.600">
              구글 계정으로 인증되었습니다. 추가 정보를 입력해주세요.
            </Text>

            <FormControl isRequired isInvalid={error && !formData.age}>
              <FormLabel>나이</FormLabel>
              <Input 
                name="age" 
                type="number" 
                value={formData.age} 
                onChange={handleChange} 
                placeholder="나이를 입력하세요" 
              />
            </FormControl>

            <FormControl isRequired isInvalid={error && !formData.gender}>
              <FormLabel>성별</FormLabel>
              <Select 
                name="gender"
                placeholder="성별을 선택하세요" 
                value={formData.gender} 
                onChange={handleChange}
              >
                <option value="남성">남성</option>
                <option value="여성">여성</option>
                <option value="기타">기타</option>
                <option value="응답하지 않음">응답하지 않음</option>
              </Select>
            </FormControl>

            <FormControl isRequired isInvalid={error && !formData.residence}>
              <FormLabel>거주지</FormLabel>
              <Input 
                name="residence"
                placeholder="거주지를 입력하세요" 
                value={formData.residence} 
                onChange={handleChange} 
              />
            </FormControl>

            {error && <Text color="red.500" fontSize="sm">{error}</Text>}

            <Button 
              type="submit" 
              colorScheme="blue" 
              w="full"
              isLoading={isLoading}
              loadingText="저장 중..."
            >
              저장하고 계속하기
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}

export default CompleteProfilePage;