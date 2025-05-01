// src/components/admin/AdminSchedules.jsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Button,
  Text,
  Flex,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

// 모달들
import AddScheduleModal from "./AddScheduleModal";
import EditScheduleModal from "./EditScheduleModal";
import AdminRouteModal from "./AdminRouteModal";

// 더미 데이터
const initialSchedules = [
  {
    id: 1,
    region: "남해",
    title: "남해 힐링 여행",
    creator: "김가천",
    date: "2025-04-10",
  },
  {
    id: 2,
    region: "제주도",
    title: "제주 먹방 투어",
    creator: "이가천",
    date: "2025-04-15",
  },
];

const AdminSchedules = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const cancelRef = React.useRef();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isRouteOpen,
    onOpen: onRouteOpen,
    onClose: onRouteClose,
  } = useDisclosure();

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    setSchedules((prev) => prev.filter((s) => s.id !== deleteTargetId));
    onDeleteClose();
  };

  const handleAdd = (newSchedule) => {
    setSchedules((prev) => [...prev, { ...newSchedule, id: Date.now() }]);
    onAddClose();
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    onEditOpen();
  };

  const handleEditSave = (updated) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    onEditClose();
  };

  const filteredSchedules = schedules
    .filter(
      (s) =>
        s.region.includes(search) ||
        s.title.includes(search) ||
        s.creator.includes(search)
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        일정 관리
      </Heading>

      <Flex mb={4} gap={4} flexWrap="wrap">
        <Input
          placeholder="지역/제목/작성자 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="250px"
        />
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          maxW="150px"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </Select>
        <Button colorScheme="teal" onClick={onAddOpen}>
          일정 추가
        </Button>
      </Flex>

      {filteredSchedules.length === 0 ? (
        <Text>등록된 일정이 없습니다.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>지역</Th>
              <Th>제목</Th>
              <Th>작성자</Th>
              <Th>출발일</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSchedules.map((s) => (
              <Tr key={s.id}>
                <Td>{s.region}</Td>
                <Td>{s.title}</Td>
                <Td>{s.creator}</Td>
                <Td>{s.date}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleEdit(s)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="gray"
                    mr={2}
                    onClick={() => {
                      setSelectedSchedule(s);
                      onRouteOpen();
                    }}
                  >
                    경로 관리
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(s.id)}
                  >
                    삭제
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>일정 삭제</AlertDialogHeader>
            <AlertDialogBody>정말 삭제하시겠습니까?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                취소
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* 모달들 */}
      {editingSchedule && (
        <EditScheduleModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          schedule={editingSchedule}
          onSave={handleEditSave}
        />
      )}

      <AddScheduleModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSave={handleAdd}
      />

      {selectedSchedule && (
        <AdminRouteModal
          isOpen={isRouteOpen}
          onClose={onRouteClose}
          scheduleId={selectedSchedule.id}
        />
      )}
    </Box>
  );
};

export default AdminSchedules;
