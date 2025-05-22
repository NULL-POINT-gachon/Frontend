import React, { useEffect, useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  Input, Select, VStack, Textarea
} from "@chakra-ui/react";

function todayISO () {
  const d = new Date();
  return d.toISOString().slice(0,10);          // "YYYY-MM-DD"
}

const AddScheduleModal = ({ isOpen, onClose, onAdd, dates = [] }) => {
  /** 1) dates 가 없으면 today 한 건으로 대체 */
  const safeDates = dates?.length ? dates : [ todayISO() ];

  const [form, setForm] = useState({
    dayIdx: 0,                     // 0,1,2…
    title:  "",
    desc:   "",
    time:   "",
    transport:"도보",
  });

  /* 2) dates 배열 바뀌면 dayIdx 0 으로 리셋 */
  useEffect(()=> setForm(prev=>({ ...prev, dayIdx:0 })), [safeDates]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const dateKey = safeDates[form.dayIdx];     // 항상 정의됨
    if (!dateKey || !form.title || !form.time) return;

    onAdd(dateKey, {               // PlanDetailPanel → DB 까지 처리
      id:   Date.now(),
      title: form.title,
      description: form.desc,
      time: form.time,
      tags: [form.transport],
      image:null,
      isHidden:false,
    });

    // 입력값 초기화 & 모달 닫기
    setForm({ dayIdx:0,title:"",desc:"",time:"",transport:"도보" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>일정 직접 추가</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={4} align="stretch">

            {/* 일차/날짜 선택 */}
            <FormControl>
              <FormLabel>날짜</FormLabel>
              <Select
                name="dayIdx"
                value={form.dayIdx}
                onChange={e=>setForm(prev=>({...prev,dayIdx:Number(e.target.value)}))}
              >
                {safeDates.map((d,i)=>(
                  <option key={d} value={i}>{`${d} (${i+1}일차)`}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>장소명</FormLabel>
              <Input name="title" value={form.title} onChange={handleChange}/>
            </FormControl>

            <FormControl>
              <FormLabel>메모</FormLabel>
              <Textarea name="desc" value={form.desc} onChange={handleChange}/>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>방문 시간</FormLabel>
              <Input type="time" name="time" value={form.time} onChange={handleChange}/>
            </FormControl>

            <FormControl>
              <FormLabel>이동 수단</FormLabel>
              <Select name="transport" value={form.transport} onChange={handleChange}>
                <option>도보</option><option>버스</option><option>택시</option>
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
