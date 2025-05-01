import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [status, setStatus] = useState(user?.status || "");
  const [reason, setReason] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setStatus(user?.status || "");
    setReason("");
    setIsChanged(false);
  }, [user]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setIsChanged(true);
  };

  const handleSubmit = () => {
    const updatedUser = { ...user, status };
    console.log("상태 변경:", updatedUser, "사유:", reason);
    toast({ title: "상태 변경 완료", status: "success", duration: 2000 });
    onSave(updatedUser);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원 상세 정보</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3} align="stretch">
            <FormControl><FormLabel>ID</FormLabel><Input value={user.id} isDisabled /></FormControl>
            <FormControl><FormLabel>닉네임</FormLabel><Input value={user.nickname} isDisabled /></FormControl>
            <FormControl><FormLabel>이메일</FormLabel><Input value={user.email} isDisabled /></FormControl>
            <FormControl><FormLabel>가입일</FormLabel><Input value={user.joinedAt || ""} isDisabled /></FormControl>
            <FormControl><FormLabel>최근 접속일</FormLabel><Input value={user.lastLogin || ""} isDisabled /></FormControl>
            <FormControl><FormLabel>일정 수</FormLabel><Input value={user.planCount || 0} isDisabled /></FormControl>
            <FormControl><FormLabel>리뷰 수</FormLabel><Input value={user.reviewCount || 0} isDisabled /></FormControl>
            <FormControl>
              <FormLabel>상태 변경</FormLabel>
              <Select value={status} onChange={handleStatusChange}>
                <option value="정상">정상</option>
                <option value="정지">정지</option>
                <option value="삭제 예정">삭제 예정</option>
              </Select>
            </FormControl>
            {isChanged && (
              <FormControl>
                <FormLabel>변경 사유</FormLabel>
                <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="변경 사유 입력" />
              </FormControl>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>취소</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isDisabled={!isChanged || reason === ""}>적용</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;