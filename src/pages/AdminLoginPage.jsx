import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AdminAuthContext } from "../contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const { login } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { username, password } = form;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate("/admin");
      } else {
        setError(result.message);
      }
    } catch {
      setError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading size="md" mb={6} textAlign="center">관리자 로그인</Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>아이디</FormLabel>
            <Input
              name="username"
              placeholder="관리자 아이디"
              value={username}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handleChange}
            />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full" isLoading={loading}>
            로그인
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AdminLoginPage;
