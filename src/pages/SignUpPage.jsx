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

  const isValidUsername = (username) => /^[a-zA-Z0-9]{4,12}$/.test(username);
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

  const existingUsernames = ["admin", "test", "guest"];

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    const { username, name, birthdate, password, confirmPassword } = formData;

    if (!username || !name || !birthdate || !password || !confirmPassword) {
      setError("모든 필드를 입력하세요.");
      return;
    }

    if (!isValidUsername(username)) {
      setError("아이디는 영문/숫자 조합 4~12자여야 합니다.");
      return;
    }

    if (existingUsernames.includes(username)) {
      setError("이미 사용 중인 아이디입니다.");
      return;
    }

    if (!isValidBirthdate(birthdate)) {
      setError("생년월일은 YYYY-MM-DD 형식으로 입력해주세요.");
      return;
    }

    if (getAge(birthdate) < 14) {
      setError("만 14세 이상만 가입 가능합니다.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("비밀번호는 8자 이상이며, 영문과 숫자를 포함해야 합니다.");
      return;
    }

    if (password === username) {
      setError("비밀번호는 아이디와 같을 수 없습니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("회원가입 성공!");
    navigate("/login");
  };

  return (
    <Flex align="center" justify="center" h="100vh" bg="gray.50">
      <Box w="400px" bg="white" p={8} boxShadow="md" borderRadius="lg">
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
