import { useState } from "react";
import {
  Box, Input, Button, Text, VStack, InputGroup,
  InputRightElement, IconButton, Flex, Divider
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    birthdate: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault(); //  form 기본 동작 방지
    setError("");

    if (!formData.username || !formData.name || !formData.birthdate || !formData.password || !formData.confirmPassword) {
      setError("모든 필드를 입력하세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("회원가입 성공!");
    navigate("/login"); // 회원가입 완료 후 로그인 화면으로 이동
  };

  return (
    <Flex align="center" justify="center" h="100vh" bg="gray.50">
      <Box w="400px" bg="white" p={8} boxShadow="md" borderRadius="lg">
        {/* form 태그로 감싸기 */}
        <form onSubmit={handleSignUp}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">회원가입</Text>

            <Text fontSize="sm">아이디</Text>
            <Input
              placeholder="아이디 입력"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            <Text fontSize="sm">이름</Text>
            <Input
              placeholder="이름 입력"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <Text fontSize="sm">생년월일</Text>
            <Input
              placeholder="YYYY-MM-DD"
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
            />

            <Text fontSize="sm">비밀번호</Text>
            <InputGroup>
              <Input
                placeholder="비밀번호 입력"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
                placeholder="비밀번호 확인"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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

            <Button type="submit" colorScheme="blue" w="full">
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
