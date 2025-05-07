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
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

const EditScheduleModal = ({ isOpen, onClose, schedule, onSave }) => {
  const [form, setForm] = useState({
    region: "",
    title: "",
    creator: "",
    date: "",
  });

  useEffect(() => {
    if (schedule) {
      setForm(schedule);
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>일정 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>지역</FormLabel>
              <Input
                name="region"
                value={form.region}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>제목</FormLabel>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>작성자</FormLabel>
              <Input
                name="creator"
                value={form.creator}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>출발일</FormLabel>
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            저장
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditScheduleModal;
