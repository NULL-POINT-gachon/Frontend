import React, { useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Select, VStack, Textarea
} from "@chakra-ui/react";

const AddScheduleModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    day: "1일차",
    title: "",
    desc: "",
    time: "",
    transport: "도보",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!form.title || !form.time) return;
    onAdd(form); // 외부 함수 호출
    setForm({ day: "1일차", title: "", desc: "", time: "", transport: "도보" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>일정 추가</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>일차 선택</FormLabel>
              <Select name="day" value={form.day} onChange={handleChange}>
                <option>1일차</option>
                <option>2일차</option>
                <option>3일차</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>장소명</FormLabel>
              <Input name="title" value={form.title} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>설명</FormLabel>
              <Textarea name="desc" value={form.desc} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>시간</FormLabel>
              <Input type="time" name="time" value={form.time} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>이동수단</FormLabel>
              <Select name="transport" value={form.transport} onChange={handleChange}>
                <option>도보</option>
                <option>자동차</option>
                <option>자전거</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAdd}>추가</Button>
          <Button variant="ghost" onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddScheduleModal;
