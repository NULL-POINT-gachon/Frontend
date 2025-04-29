// src/components/mypage/EditableInfoRow.jsx
import React from "react";
import {
    Flex,
    Text,
    Input,
    IconButton,
    useDisclosure,
    HStack,
    useToast,
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
  
  const EditableInfoRow = ({ label, value, onSave }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editedValue, setEditedValue] = useState(value);
    const toast = useToast();
  
    // 외부 value 변경 시 editedValue도 동기화
    useEffect(() => {
      setEditedValue(value);
    }, [value]);
  
    const handleSave = () => {
      onSave(editedValue);
      onClose();
  
      // 저장 완료 메시지 표시
      toast({
        title: "저장 완료",
        description: `"${label}" 항목이 수정되었습니다.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    };
  
    const handleCancel = () => {
      setEditedValue(value);
      onClose();
    };
  
    return (
      <Flex
        justify="space-between"
        align="center"
        bg="white"
        p={3}
        rounded="md"
        shadow="sm"
      >
        <Text fontWeight="medium">{label}</Text>
  
        {isOpen ? (
          <HStack spacing={2}>
            <Input
              size="sm"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <IconButton
              icon={<FaCheck />}
              size="sm"
              colorScheme="green"
              onClick={handleSave}
              aria-label="저장"
            />
            <IconButton
              icon={<FaTimes />}
              size="sm"
              onClick={handleCancel}
              aria-label="취소"
            />
          </HStack>
        ) : (
          <HStack spacing={3}>
            <Text color="gray.600">{value}</Text>
            <IconButton
              icon={<FaEdit />}
              size="sm"
              variant="ghost"
              onClick={onOpen}
              aria-label="수정"
            />
          </HStack>
        )}
      </Flex>
    );
  };
  
  export default EditableInfoRow;
  