// src/components/admin/places/EditPlaceModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Select,
  useToast,
} from "@chakra-ui/react";

const EditPlaceModal = ({ isOpen, onClose, place, onSave }) => {
  const [formData, setFormData] = useState({
    destination_name: "",
    address: "",
    category: "",
    description: "",
    latitude: "",
    longitude: "",
    phone_number: "",
    operating_hours: "",
  });
  const toast = useToast();

  useEffect(() => {
    if (place) {
      setFormData({
        destination_name: place.destination_name || "",
        address: place.address || "",
        category: place.category || "",
        description: place.description || "",
        latitude: place.latitude || "",
        longitude: place.longitude || "",
        phone_number: place.phone_number || "",
        operating_hours: place.operating_hours || "",
      });
    } else {
      setFormData({
        destination_name: "",
        address: "",
        category: "",
        description: "",
        latitude: "",
        longitude: "",
        phone_number: "",
        operating_hours: "",
      });
    }
  }, [place]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.destination_name || !formData.address || !formData.category) {
      toast({
        title: "필수 정보 누락",
        description: "장소명, 주소, 카테고리는 필수 입력 항목입니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.latitude && isNaN(formData.latitude)) {
      toast({
        title: "위도 형식 오류",
        description: "위도는 숫자로 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.longitude && isNaN(formData.longitude)) {
      toast({
        title: "경도 형식 오류",
        description: "경도는 숫자로 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const updated = {
        ...formData,
        id: place?.id,
      };

      onSave(updated); // 부모 컴포넌트에서 axios 처리 및 fetch 수행
      onClose();       // 모달 닫기
    } catch (error) {
      toast({
        title: "처리 실패",
        description: "처리 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{place ? "여행지 수정" : "여행지 등록"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>장소명</FormLabel>
                <Input
                  name="destination_name"
                  value={formData.destination_name}
                  onChange={handleChange}
                  placeholder="장소명을 입력하세요"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>주소</FormLabel>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="주소를 입력하세요"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>카테고리</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="카테고리를 선택하세요"
                >
                  <option value="관광지">관광지</option>
                  <option value="음식점">음식점</option>
                  <option value="숙소">숙소</option>
                  <option value="쇼핑">쇼핑</option>
                  <option value="문화시설">문화시설</option>
                  <option value="레저">레저</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="장소에 대한 설명을 입력하세요"
                />
              </FormControl>

              <FormControl>
                <FormLabel>위도</FormLabel>
                <Input
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="위도를 입력하세요"
                />
              </FormControl>

              <FormControl>
                <FormLabel>경도</FormLabel>
                <Input
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="경도를 입력하세요"
                />
              </FormControl>

              <FormControl>
                <FormLabel>전화번호</FormLabel>
                <Input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="전화번호를 입력하세요"
                />
              </FormControl>

              <FormControl>
                <FormLabel>운영시간</FormLabel>
                <Input
                  name="operating_hours"
                  value={formData.operating_hours}
                  onChange={handleChange}
                  placeholder="운영시간을 입력하세요"
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full">
                {place ? "수정하기" : "등록하기"}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditPlaceModal;
