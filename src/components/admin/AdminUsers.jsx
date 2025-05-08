import React, { useState, useRef, useEffect } from "react";
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, Badge, Input, Select,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter, useToast
} from "@chakra-ui/react";
import axios from 'axios'; // axios import
import EditUserModal from "./EditUserModal";
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [sortOption, setSortOption] = useState("이름순");
  const [users, setUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetLogoutUser, setTargetLogoutUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const cancelRef = useRef();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  // 사용자 목록을 API에서 받아오는 함수
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "로그인이 필요합니다",
          description: "관리자 페이지 접근을 위해 로그인해주세요.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:3000/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("사용자 목록 가져오기 오류:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          toast({
            title: "인증 오류",
            description: "로그인이 만료되었습니다. 다시 로그인해주세요.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response.status === 403) {
          toast({
            title: "권한 없음",
            description: "관리자 권한이 필요합니다.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          navigate('/');
        }
      } else {
        toast({
          title: "오류 발생",
          description: "서버와의 통신 중 문제가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  useEffect(() => {
    fetchUsers(); // 컴포넌트가 처음 마운트될 때 사용자 목록을 가져옵니다.
  }, []); // 빈 배열을 넣어서 최초 렌더링 시 한 번만 호출되게 합니다.

  const filteredUsers = users.filter((u) => {
    const matchesKeyword = u.name?.includes(searchTerm) || u.email?.includes(searchTerm);
    const matchesStatus = statusFilter === "전체" || u.status === statusFilter;
    return matchesKeyword && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === "이름순") return a.name?.localeCompare(b.name);
    if (sortOption === "가입순") return new Date(a.created_at) - new Date(b.created_at);
    if (sortOption === "최신가입순") return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  console.log("Filtered users: ", filteredUsers); // 필터링된 사용자 목록 확인
  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:3000/admin/users/${userId}/status`,
        { status: 2 }, // 삭제 예정 상태
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "삭제 예정 처리 성공",
          description: "사용자가 삭제 예정 상태로 변경되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchUsers(); // 목록 새로고침
      }
    } catch (error) {
      toast({
        title: "삭제 예정 처리 실패",
        description: error.response?.data?.message || "상태 변경 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsDeleteOpen(false);
  };

  const handleLogout = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:3000/admin/users/${userId}/status`,
        { status: 0 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "상태 변경 성공",
          description: "사용자 상태가 변경되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchUsers(); // 목록 새로고침
      }
    } catch (error) {
      toast({
        title: "상태 변경 실패",
        description: error.response?.data?.message || "상태 변경 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLogoutOpen(false);
  };

  const handleSave = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  return (
    <Box p={6}>
      <Heading size="md" mb={6}>회원 관리</Heading>

      <Box display="flex" gap={4} mb={4} flexWrap="wrap">
        <Input placeholder="이름 또는 이메일" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} maxW="300px" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} maxW="150px">
          <option value="전체">전체 상태</option>
          <option value="정상">정상</option>
          <option value="정지">정지</option>
          <option value="삭제 예정">삭제 예정</option>
        </Select>
        <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} maxW="150px">
          <option value="이름순">이름순</option>
          <option value="가입순">가입순</option>
          <option value="최신가입순">최신가입순</option>
        </Select>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>이름</Th>
            <Th>이메일</Th>
            <Th>권한</Th>
            <Th>상태</Th>
            <Th>가입일</Th>
            <Th>관리</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td><Badge colorScheme={user.status === 1 ? "green" : user.status === 0 ? "red" : "orange"}>{user.status === 1 ? "정상" : user.status === 0 ? "정지" : "삭제 예정"}</Badge></Td>
              <Td>{new Date(user.created_at).toLocaleDateString()}</Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2} onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}>수정</Button>
                <Button size="sm" colorScheme="orange" mr={2} onClick={() => { setTargetLogoutUser(user); setIsLogoutOpen(true); }}>로그아웃</Button>
                <Button size="sm" colorScheme="red" onClick={() => { setTargetUserId(user.id); setIsDeleteOpen(true); }}>삭제</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={() => setIsDeleteOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>회원 삭제</AlertDialogHeader>
            <AlertDialogBody>정말 삭제하시겠습니까?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>취소</Button>
              <Button colorScheme="red" onClick={() => handleDelete(targetUserId)} ml={3}>삭제</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={isLogoutOpen} leastDestructiveRef={cancelRef} onClose={() => setIsLogoutOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>강제 로그아웃</AlertDialogHeader>
            <AlertDialogBody>{targetLogoutUser?.name}님을 로그아웃하시겠습니까?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsLogoutOpen(false)}>취소</Button>
              <Button colorScheme="orange" onClick={() => handleLogout(targetLogoutUser.id)} ml={3}>로그아웃</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        onSave={handleSave}
      />
    </Box>
  );
};

export default AdminUsers;