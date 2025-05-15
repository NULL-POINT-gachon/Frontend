// src/components/admin/places/EditPlaceModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, NumberInput, NumberInputField,
  Button, VStack, Select, useToast, HStack
} from "@chakra-ui/react";

export default function EditPlaceModal({ isOpen, onClose, place, onSave }) {
  const toast = useToast();

  /* ───────────────── state ───────────────── */
  const [form, setForm] = useState({
    destination_name      : "",
    destination_description: "",
    category              : "",
    indoor_outdoor        : "실외",
    entrance_fee          : 0,
    latitude              : "",
    longitude             : "",
    image                 : ""
  });

  /* ───────── place prop ↔ state 동기화 ──────── */
  useEffect(() => {
    if (place) {
      setForm({
        destination_name      : place.destination_name       ?? "",
        destination_description: place.destination_description?? "",
        category              : place.category               ?? "",
        indoor_outdoor        : place.indoor_outdoor         ?? "실외",
        entrance_fee          : place.entrance_fee           ?? 0,
        latitude              : place.latitude               ?? "",
        longitude             : place.longitude              ?? "",
        image                 : place.image                  ?? ""
      });
    } else {
      setForm(f => ({ ...f,                                // 신규 등록 → 초기화
        destination_name:"", destination_description:"",
        category:"", indoor_outdoor:"실외", entrance_fee:0,
        latitude:"", longitude:"", image:""
      }));
    }
  }, [place]);

  /* ───────────────── 핸들러 ───────────────── */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleNumber = (v, name) =>
    setForm(prev => ({ ...prev, [name]: Number(v) || 0 }));

  const handleSubmit = e => {
    e.preventDefault();

    /* 필수값 체크 */
    if (!form.destination_name.trim() || !form.category.trim()) {
      toast({ title:"필수 정보 누락", description:"장소명과 카테고리는 필수입니다.", status:"error" });
      return;
    }

    /* 위도·경도 숫자 여부 */
    if (form.latitude && isNaN(form.latitude))  {
      return toast({ title:"위도 입력 오류", status:"error", description:"숫자로 입력하세요." });
    }
    if (form.longitude && isNaN(form.longitude)) {
      return toast({ title:"경도 입력 오류", status:"error", description:"숫자로 입력하세요." });
    }

    onSave({ ...form, id: place?.id });   // 부모(AdminPlaces)가 axios 처리
  };

  /* ───────────────── UI ───────────────── */
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay/>
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>{place ? "여행지 수정" : "여행지 등록"}</ModalHeader>
        <ModalCloseButton/>
        <ModalBody pb={6}>
          <VStack spacing={4}>

            {/* 장소명 */}
            <FormControl isRequired>
              <FormLabel>장소명</FormLabel>
              <Input
                name="destination_name"
                value={form.destination_name}
                onChange={handleChange}
                placeholder="예) 남산타워"
              />
            </FormControl>

            {/* 카테고리 */}
            <FormControl isRequired>
              <FormLabel>카테고리</FormLabel>
              <Select name="category" value={form.category} onChange={handleChange}>
                <option value="">선택…</option>
                <option value="관광지">관광지</option>
                <option value="음식점">음식점</option>
                <option value="숙소">숙소</option>
                <option value="쇼핑">쇼핑</option>
                <option value="문화시설">문화시설</option>
                <option value="레저">레저</option>
              </Select>
            </FormControl>

            {/* 실내/실외 */}
            <FormControl>
              <FormLabel>실내 / 실외</FormLabel>
              <Select name="indoor_outdoor" value={form.indoor_outdoor} onChange={handleChange}>
                <option value="실내">실내</option>
                <option value="실외">실외</option>
              </Select>
            </FormControl>

            {/* 입장료 */}
            <FormControl>
              <FormLabel>입장료 (₩)</FormLabel>
              <NumberInput value={form.entrance_fee} onChange={v=>handleNumber(v,"entrance_fee")} min={0}>
                <NumberInputField/>
              </NumberInput>
            </FormControl>

            {/* 설명 */}
            <FormControl>
              <FormLabel>설명</FormLabel>
              <Textarea
                name="destination_description"
                value={form.destination_description}
                onChange={handleChange}
                placeholder="장소 소개 · 특징"
              />
            </FormControl>

            {/* 위도/경도 */}
            <HStack w="100%">
              <FormControl>
                <FormLabel>위도</FormLabel>
                <Input name="latitude" value={form.latitude} onChange={handleChange}/>
              </FormControl>
              <FormControl>
                <FormLabel>경도</FormLabel>
                <Input name="longitude" value={form.longitude} onChange={handleChange}/>
              </FormControl>
            </HStack>

            {/* 이미지 URL */}
            <FormControl>
              <FormLabel>대표 이미지 URL</FormLabel>
              <Input name="image" value={form.image} onChange={handleChange}/>
            </FormControl>

            <Button type="submit" colorScheme="blue" w="full">
              {place ? "수정하기" : "등록하기"}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
