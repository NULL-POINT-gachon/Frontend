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
  /** ───────── 백엔드/드롭다운과 동일하게 필드명 맞춤 ───────── **/
  senderName,          // 초대한 사람
  tripTitle,
  startDate,
  endDate,
  shareId,
  location,
  participants = [],
  onAccept,
  onDecline,
}) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  /* 날짜 포맷 */
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "날짜 미정";

  /* 수락 */
  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await onAccept?.(message);
      toast({ title: "초대를 수락했습니다.", status: "success", duration: 2000, isClosable: true });
      onClose();
    } catch (e) {
      console.error(e);
      toast({ title: "수락 처리 실패", status: "error", duration: 3000, isClosable: true });
    } finally {
      setSubmitting(false);
    }
  };

  /* 거절 */
  const handleDecline = async () => {
    setSubmitting(true);
    try {
      await onDecline?.();
      toast({ title: "초대를 거절했습니다.", status: "info", duration: 2000, isClosable: true });
      onClose();
    } catch (e) {
      console.error(e);
      toast({ title: "거절 처리 실패", status: "error", duration: 3000, isClosable: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>여행 일정 초대</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              <strong>{senderName}</strong> 님이 여행 일정에 초대했습니다.
            </Text>

            {/* 일정 카드 */}
            <Box borderWidth="1px" borderRadius="lg" p={4} bg="blue.50">
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {tripTitle || "여행 일정"}
              </Text>

              <Flex justify="space-between" mb={1}>
                <Text color="gray.600">여행 기간</Text>
                <Text fontWeight="medium">
                  {fmt(startDate)} ~ {fmt(endDate)}
                </Text>
              </Flex>

              <Flex justify="space-between" mb={1}>
                <Text color="gray.600">여행지</Text>
                <Text fontWeight="medium">{location || "장소 미정"}</Text>
              </Flex>

              <Flex justify="space-between" align="flex-start">
                <Text color="gray.600">참여자</Text>
                <Flex flexWrap="wrap" justify="flex-end">
                  {participants.length ? (
                    participants.map((p, i) => (
                      <Badge key={i} colorScheme="blue" m={0.5}>
                        {p}
                      </Badge>
                    ))
                  ) : (
                    <Text>참여자 정보 없음</Text>
                  )}
                </Flex>
              </Flex>
            </Box>

            {/* 메시지 입력 */}
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
          <Button colorScheme="red" mr={3} onClick={handleDecline} isLoading={submitting}>
            거절하기
          </Button>
          <Button colorScheme="blue" onClick={handleAccept} isLoading={submitting}>
            참여하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InviteResponseModal;
