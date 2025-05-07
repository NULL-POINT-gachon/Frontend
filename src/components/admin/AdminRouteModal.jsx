import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";

const AdminRouteModal = ({ isOpen, onClose, scheduleId }) => {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ time: "", place: "", description: "" });
  const [editIndex, setEditIndex] = useState(null);

  // 일정 ID 변경되면 routes 초기화 (임시 데이터 시나리오)
  useEffect(() => {
    if (!scheduleId) return;

    // 예시로 일정 ID가 1이면 기본 데이터 삽입
    if (scheduleId === 1) {
      setRoutes([
        { id: 1, time: "09:00", place: "동문시장", description: "아침 식사" },
        { id: 2, time: "11:00", place: "협재해수욕장", description: "해수욕" },
      ]);
    } else {
      setRoutes([]);
    }
  }, [scheduleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!form.time || !form.place) return;
    setRoutes((prev) => [...prev, { ...form, id: Date.now() }]);
    setForm({ time: "", place: "", description: "" });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(routes[index]);
  };

  const handleSaveEdit = () => {
    setRoutes((prev) =>
      prev.map((item, idx) => (idx === editIndex ? { ...item, ...form } : item))
    );
    setEditIndex(null);
    setForm({ time: "", place: "", description: "" });
  };

  const handleDelete = (id) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>경로 관리</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {scheduleId ? (
            <>
              <VStack spacing={3} mb={4}>
                <FormControl>
                  <FormLabel>시간</FormLabel>
                  <Input
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    placeholder="예: 09:00"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>장소</FormLabel>
                  <Input
                    name="place"
                    value={form.place}
                    onChange={handleChange}
                    placeholder="예: 협재 해수욕장"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>설명</FormLabel>
                  <Input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="간단한 설명"
                  />
                </FormControl>
                <HStack>
                  {editIndex === null ? (
                    <Button colorScheme="teal" onClick={handleAdd}>
                      추가
                    </Button>
                  ) : (
                    <Button colorScheme="blue" onClick={handleSaveEdit}>
                      수정 완료
                    </Button>
                  )}
                </HStack>
              </VStack>

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>시간</Th>
                    <Th>장소</Th>
                    <Th>설명</Th>
                    <Th>관리</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {routes.map((r, idx) => (
                    <Tr key={r.id}>
                      <Td>{r.time}</Td>
                      <Td>{r.place}</Td>
                      <Td>{r.description}</Td>
                      <Td>
                        <Button size="sm" mr={2} onClick={() => handleEdit(idx)}>
                          수정
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(r.id)}
                        >
                          삭제
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          ) : (
            <Text color="gray.500">선택된 일정이 없습니다.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminRouteModal;
