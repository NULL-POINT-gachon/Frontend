// src/components/admin/places/EditPlaceDetailModal.jsx
import React, { useEffect, useState } from "react";
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
  Textarea,
  VStack,
  useToast,
  Image,
} from "@chakra-ui/react";

const EditPlaceDetailModal = ({ isOpen, onClose, place, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    region: "",
    description: "",
    tag: "",
    image: null,
    imagePreview: "",
  });
  const toast = useToast();

  useEffect(() => {
    if (place) {
      setForm({
        name: place.name || "",
        region: place.region || "",
        description: place.description || "",
        tag: place.tag || "",
        image: null,
        imagePreview: place.image || "",
      });
    }
  }, [place]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file),
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.region || !form.description || !form.tag) {
      toast({
        title: "입력값 오류",
        description: "모든 필드를 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedPlace = {
      ...place,
      name: form.name,
      region: form.region,
      description: form.description,
      tag: form.tag,
      image: form.imagePreview, // 백엔드 연동 시 파일 또는 URL 처리
    };

    toast({
      title: "장소 정보가 수정되었습니다.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onSave(updatedPlace);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>장소 정보 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>장소명</FormLabel>
              <Input name="name" value={form.name} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>주소</FormLabel>
              <Input name="region" value={form.region} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>태그</FormLabel>
              <Input name="tag" value={form.tag} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>설명</FormLabel>
              <Textarea name="description" value={form.description} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>이미지 업로드</FormLabel>
              <Input type="file" name="image" accept="image/*" onChange={handleChange} />
              {form.imagePreview && (
                <Image src={form.imagePreview} alt="미리보기" mt={3} borderRadius="md" />
              )}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>취소</Button>
          <Button colorScheme="blue" onClick={handleSubmit}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPlaceDetailModal;
