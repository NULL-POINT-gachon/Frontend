import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Heading,
  HStack,
  VStack,
  Divider,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";

function InviteResponseModal({
  isOpen,
  onClose,
  inviter = "김가천",
  tripTitle = "제주도 여행 3박 4일",
  startDate = "2025.3.15",
  endDate = "2025.3.18",
  location = "제주도",
  participants = ["김가천", "이가천", "외 2명"],
  onAccept,
  onDecline,
}) {
  const [message, setMessage] = useState("");

  const handleAccept = () => {
    onAccept?.(message);
    onClose();
  };

  const handleDecline = () => {
    onDecline?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" overflow="hidden">
        <ModalHeader bg="blue.50" borderBottomWidth="1px">
          <Heading size="md">여행 초대장</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack align="stretch" spacing={4}>
            <Text fontWeight="bold">{inviter} 님이 당신을 여행에 초대했습니다.</Text>
            <Box bg="gray.100" p={4} borderRadius="md">
              <Heading size="sm" mb={1}>{tripTitle}</Heading>
              <Text fontSize="sm" color="gray.600">
                {startDate} - {endDate}
              </Text>
              <Divider my={3} />
              <Text fontSize="sm">지역: {location}</Text>
              <Text fontSize="sm">참가자: {participants.join(", ")}</Text>
              <Button variant="link" colorScheme="blue" size="sm" mt={2}>
                상세 일정 보기
              </Button>
            </Box>

            <FormControl>
              <FormLabel fontSize="sm">메시지 남기기 (선택)</FormLabel>
              <Textarea
                size="sm"
                placeholder="여행에 대한 간단한 소감을 남겨주세요."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter bg="gray.50" borderTopWidth="1px">
          <HStack spacing={3}>
            <Button variant="outline" onClick={handleDecline}>
              거절하기
            </Button>
            <Button colorScheme="blue" onClick={handleAccept}>
              수락하기
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InviteResponseModal;
