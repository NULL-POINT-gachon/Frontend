import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Flex,
  Textarea,
  VStack,
  Badge,
  useToast,
} from "@chakra-ui/react";

function InviteResponseModal({
  isOpen,
  onClose,
  inviter,
  tripTitle,
  startDate,
  endDate,
  location,
  participants = [],
  onAccept,
  onDecline,
}) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 미정";
    
    try {
      // ISO 날짜 문자열 또는 다른 형식의 날짜 문자열 처리
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      // 날짜 변환 실패 시 원본 문자열 반환
      return dateString;
    }
  };

  // 수락 버튼 클릭 핸들러
  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await onAccept(message);
    } catch (error) {
      console.error("초대 수락 처리 실패:", error);
      toast({
        title: "초대 수락을 처리하지 못했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 거절 버튼 클릭 핸들러
  const handleDecline = async () => {
    setIsSubmitting(true);
    try {
      await onDecline();
    } catch (error) {
      console.error("초대 거절 처리 실패:", error);
      toast({
        title: "초대 거절을 처리하지 못했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>여행 일정 초대</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              <strong>{inviter}</strong>님이 여행 일정에 초대했습니다.
            </Text>
            
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              bg="blue.50"
            >
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {tripTitle || "여행 일정"}
              </Text>
              
              <Flex justify="space-between" mb={1}>
                <Text color="gray.600">여행 기간</Text>
                <Text fontWeight="medium">
                  {formatDate(startDate)} ~ {formatDate(endDate)}
                </Text>
              </Flex>
              
              <Flex justify="space-between" mb={1}>
                <Text color="gray.600">여행지</Text>
                <Text fontWeight="medium">{location || "장소 미정"}</Text>
              </Flex>
              
              <Flex justify="space-between" alignItems="flex-start">
                <Text color="gray.600">참여자</Text>
                <Flex flexWrap="wrap" justifyContent="flex-end">
                  {participants && participants.length > 0 ? (
                    participants.map((participant, index) => (
                      <Badge 
                        key={index} 
                        colorScheme="blue" 
                        m={0.5}
                      >
                        {participant}
                      </Badge>
                    ))
                  ) : (
                    <Text>참여자 정보 없음</Text>
                  )}
                </Flex>
              </Flex>
            </Box>
            
            <Box>
              <Text mb={2}>메시지 (선택사항)</Text>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="참여 메시지를 입력하세요..."
                resize="vertical"
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={handleDecline}
            isLoading={isSubmitting}
          >
            거절하기
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleAccept}
            isLoading={isSubmitting}
          >
            참여하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InviteResponseModal;