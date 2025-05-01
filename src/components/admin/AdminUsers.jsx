import React, { useState, useRef } from "react";
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, Badge, Input, Select,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter
} from "@chakra-ui/react";
import dummyUsers from "./dummyUsers";
import EditUserModal from "./EditUserModal";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [sortOption, setSortOption] = useState("이름순");
  const [users, setUsers] = useState(dummyUsers);
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetLogoutUser, setTargetLogoutUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const cancelRef = useRef();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((u) => {
    const matchesKeyword = u.nickname.includes(searchTerm) || u.email.includes(searchTerm);
    const matchesStatus = statusFilter === "전체" || u.status === statusFilter;
    return matchesKeyword && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === "이름순") return a.nickname.localeCompare(b.nickname);
    if (sortOption === "가입순") return new Date(a.joinedAt) - new Date(b.joinedAt);
    if (sortOption === "최신가입순") return new Date(b.joinedAt) - new Date(a.joinedAt);
    return 0;
  });

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== targetUserId));
    setIsDeleteOpen(false);
  };

  const handleLogout = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === targetLogoutUser.id ? { ...u, status: "정지" } : u))
    );
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
        <Input placeholder="닉네임 또는 이메일" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} maxW="300px" />
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
            <Th>닉네임</Th>
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
              <Td>{user.nickname}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td><Badge colorScheme={user.status === "정상" ? "green" : user.status === "정지" ? "red" : "orange"}>{user.status}</Badge></Td>
              <Td>{user.joinedAt}</Td>
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
              <Button colorScheme="red" onClick={handleDelete} ml={3}>삭제</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={isLogoutOpen} leastDestructiveRef={cancelRef} onClose={() => setIsLogoutOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>강제 로그아웃</AlertDialogHeader>
            <AlertDialogBody>{targetLogoutUser?.nickname}님을 로그아웃하시겠습니까?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsLogoutOpen(false)}>취소</Button>
              <Button colorScheme="orange" onClick={handleLogout} ml={3}>로그아웃</Button>
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
