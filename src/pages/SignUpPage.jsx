import React from "react";
import { useState } from "react";
import {
  Box, Input, Button, Text, VStack, InputGroup,
  InputRightElement, IconButton, Flex, Divider
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",  // 이 필드가 이메일로 사용됨
    name: "",
    birthdate: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 이메일로 사용되는 username의 유효성 검사
  const isValidEmail = (email) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()]{8,}$/.test(password);
  const isValidBirthdate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

  const getAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const existingUsernames = ["admin@test.com", "test@test.com", "guest@test.com"];

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    console.log("Form data:", formData);

    const { username, name, birthdate, password, confirmPassword } = formData;
    
    // 디버그용 로그
    console.log({
      hasUsername: Boolean(username.trim()),
      hasName: Boolean(name.trim()),
      hasBirthdate: Boolean(birthdate),
      hasPassword: Boolean(password.trim()),
      hasConfirmPassword: Boolean(confirmPassword.trim())
    });

    // 모든 필드 채워졌는지 확인
    if (!username.trim() || !name.trim() || !birthdate || !password.trim() || !confirmPassword.trim()) {
      setError("모든 필드를 입력하세요.");
      setIsLoading(false);
      return;
    }

    // 이메일 형식 검증
    if (!isValidEmail(username)) {
      setError("유효한 이메일 형식이 아닙니다.");
      setIsLoading(false);
      return;
    }

    if (existingUsernames.includes(username)) {
      setError("이미 사용 중인 이메일입니다.");
      setIsLoading(false);
      return;
    }

    if (!isValidBirthdate(birthdate)) {
      setError("생년월일은 YYYY-MM-DD 형식으로 입력해주세요.");
      setIsLoading(false);
      return;
    }

    if (getAge(birthdate) < 14) {
      setError("만 14세 이상만 가입 가능합니다.");
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setError("비밀번호는 8자 이상이며, 영문과 숫자를 포함해야 합니다.");
      setIsLoading(false);
      return;
    }

    if (password === username) {
      setError("비밀번호는 이메일과 같을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }
    
    try {
      const age = getAge(birthdate);
      
      // 백엔드 API 요청 - username을 email로 전송
      const response = await fetch('http://localhost:3000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: username,  // username 필드를 email로 사용
          password: password,
          age: age,
          gender: null, 
          residence: null
        })
      });
      
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || '회원가입 중 오류가 발생했습니다.');
      }
  
      alert("회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      setError(error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" h="100vh" bg="gray.50">
      <Box w="400px" bg="white" p={8} boxShadow="md" borderRadius="lg">
        <form onSubmit={handleSignUp}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">회원가입</Text>

            <Text fontSize="sm">이메일</Text>
            <Input 
              name="username" 
              type="email"
              value={formData.username} 
              onChange={handleChange} 
              placeholder="이메일 입력" 
            />

            <Text fontSize="sm">이름</Text>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="이름 입력" 
            />

            <Text fontSize="sm">생년월일</Text>
            <Input 
              name="birthdate" 
              type="date" 
              value={formData.birthdate} 
              onChange={handleChange} 
            />

            <Text fontSize="sm">비밀번호</Text>
            <InputGroup>
              <Input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="비밀번호 입력" 
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

            <Text fontSize="sm">비밀번호 확인</Text>
            <InputGroup>
              <Input 
                name="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="비밀번호 확인" 
              />
              <InputRightElement>
                <IconButton 
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />} 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  variant="ghost" 
                  aria-label="비밀번호 확인 보기" 
                />
              </InputRightElement>
            </InputGroup>

            {error && <Text color="red.500" fontSize="sm">{error}</Text>}

            <Button 
              type="submit" 
              colorScheme="blue" 
              w="full"
              isLoading={isLoading}
              loadingText="처리 중..."
            >
              회원가입
            </Button>

            <Divider />

            <Button variant="link" colorScheme="blue" onClick={() => navigate("/login")}>
              로그인 화면으로 이동
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}

export default SignUpPage;