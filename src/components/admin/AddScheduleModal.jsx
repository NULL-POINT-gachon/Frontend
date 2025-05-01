import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

const AddScheduleModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = React.useState({
    region: "",
    title: "",
    creator: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.region || !form.title || !form.creator || !form.date) return;
    onSave(form);
    setForm({ region: "", title: "", creator: "", date: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>일정 추가</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3}>
            <FormControl>
              <FormLabel>지역</FormLabel>
              <Input name="region" value={form.region} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>제목</FormLabel>
              <Input name="title" value={form.title} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>작성자</FormLabel>
              <Input name="creator" value={form.creator} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>출발일</FormLabel>
              <Input type="date" name="date" value={form.date} onChange={handleChange} />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSave}>추가</Button>
          <Button onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddScheduleModal;
