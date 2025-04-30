import React, { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, Box, Text, HStack, VStack, Input, IconButton,
  Divider, Badge, useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const InviteModal = ({ isOpen, onClose, regionName, startDate, endDate }) => {
  const toast = useToast();

  const [inviteMethod, setInviteMethod] = useState("email");
  const [emailInput, setEmailInput] = useState("");
  const [invitedFriends, setInvitedFriends] = useState([]);

  const handleAddEmail = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
    if (!isValidEmail) {
      toast({ title: "이메일 형식이 올바르지 않습니다.", status: "warning", isClosable: true });
      return;
    }

    const newFriend = {
      name: emailInput.split("@")[0],
      email: emailInput,
      status: "대기중",
    };
    setInvitedFriends([...invitedFriends, newFriend]);
    setEmailInput("");
  };

  const handleInviteSubmit = () => {
    // 추후 백엔드 연동 예정
    toast({
      title: "공유 요청이 전송되었습니다.",
      description: `${invitedFriends.length}명에게 초대 이메일이 발송됩니다.`,
      status: "success",
      isClosable: true,
    });
    onClose();
  };

  // 모달 닫을 때 초기화
  useEffect(() => {
    if (!isOpen) {
      setEmailInput("");
      setInvitedFriends([]);
      setInviteMethod("email");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>친구 초대하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb={1}>{regionName} 여행 초대</Text>
          <Text fontSize="sm" color="gray.600" mb={4}>{startDate} ~ {endDate}</Text>

          <HStack mb={4} spacing={2}>
            <Button
              variant={inviteMethod === "email" ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => setInviteMethod("email")}
            >
              이메일
            </Button>
            <Button
              variant={inviteMethod === "link" ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => setInviteMethod("link")}
            >
              링크
            </Button>
          </HStack>

          {inviteMethod === "email" && (
            <Box mb={4}>
              <HStack>
                <Input
                  placeholder="초대할 이메일 주소 입력"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <IconButton
                  icon={<AddIcon />}
                  colorScheme="blue"
                  onClick={handleAddEmail}
                  aria-label="추가"
                />
              </HStack>
              <Text fontSize="sm" mt={1} color="gray.500">
                이메일 주소를 입력해 초대 요청을 보낼 수 있습니다.
              </Text>
            </Box>
          )}

          {inviteMethod === "link" && (
            <Box mb={4}>
              <Text fontSize="sm" color="gray.500" mb={2}>아래 링크를 복사해 공유하세요:</Text>
              <Box bg="gray.100" p={2} borderRadius="md" fontSize="sm">
                https://yourapp.com/invite?tripId=abc123
              </Box>
            </Box>
          )}

          <Divider mb={4} />

          <VStack align="stretch" spacing={3}>
            {invitedFriends.map((friend, idx) => (
              <HStack key={idx} justify="space-between">
                <Box>
                  <Text fontWeight="bold">{friend.name}</Text>
                  <Text fontSize="sm" color="gray.500">{friend.email}</Text>
                </Box>
                <Badge colorScheme={friend.status === "수락됨" ? "green" : "gray"}>
                  {friend.status}
                </Badge>
              </HStack>
            ))}
          </VStack>

          {invitedFriends.length > 0 && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              총 {invitedFriends.length}명 초대됨
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={2} onClick={handleInviteSubmit}>
            공유 요청
          </Button>
          <Button variant="ghost" onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
