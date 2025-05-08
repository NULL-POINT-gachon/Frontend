import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import Header from "../components/Header";
import InviteResponseModal from "../components/InviteResponseModal";
import axios from "axios";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [inviteData, setInviteData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // 실제 API가 생기면 아래 두 줄로 교체하세요
        // const res = await axios.get("/notifications");
        // setNotifications(res.data.notifications || []);

        // 현재는 더미 데이터 사용
        const dummy = [
          {
            id: 1,
            type: "invite",
            message: "홍길동님이 여행 일정을 공유했습니다.",
            inviter: "홍길동",
            tripTitle: "전주 여행 1박2일",
            startDate: "2025.5.01",
            endDate: "2025.5.02",
            location: "전주",
            participants: ["홍길동", "이철수"],
          },
          {
            id: 2,
            type: "update",
            message: "속초 여행 일정이 수정되었습니다.",
          },
          {
            id: 3,
            type: "comment",
            message: "강릉 일정에 새로운 댓글이 달렸습니다.",
          },
        ];

        setNotifications(dummy);
      } catch (err) {
        console.error("알림 목록 불러오기 실패:", err);
        toast({
          title: "알림을 불러오지 못했습니다.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);

  const handleClickNotification = async (noti) => {
    try {
      // 실제 연동 시 사용
      // await axios.patch(`/notifications/${noti.id}/read`);

      if (noti.type === "invite") {
        setInviteData(noti);
        setIsOpen(true);
      } else {
        toast({
          title: "아직 지원하지 않는 알림입니다.",
          status: "info",
          duration: 1500,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("알림 클릭 처리 실패:", err);
    }
  };

  const handleAccept = async (message) => {
    try {
      await axios.post("/invitations/accept", {
        inviteId: inviteData.id,
        message,
      });
      toast({
        title: "초대를 수락했습니다.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setIsOpen(false);
    } catch (err) {
      console.error("수락 실패:", err);
      toast({
        title: "수락에 실패했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDecline = async () => {
    try {
      await axios.post("/invitations/decline", {
        inviteId: inviteData.id,
      });
      toast({
        title: "초대를 거절했습니다.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      setIsOpen(false);
    } catch (err) {
      console.error("거절 실패:", err);
      toast({
        title: "거절에 실패했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" minH="100vh">
      <Header />

      <Box bgGradient="linear(to-b, blue.100, white)" py={10} textAlign="center">
        <Heading size="lg">🔔 알림 목록</Heading>
      </Box>

      <Container maxW="700px" py={8}>
        <VStack spacing={4} align="stretch">
          {Array.isArray(notifications) &&
            notifications.map((noti) => (
              <HStack
                key={noti.id}
                bg="white"
                p={4}
                borderRadius="md"
                boxShadow="sm"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                onClick={() => handleClickNotification(noti)}
              >
                <Text>{noti.message}</Text>
                <Spacer />
                <Button size="sm" colorScheme="blue" variant="outline">
                  상세 보기
                </Button>
              </HStack>
            ))}
        </VStack>
      </Container>

      {/* 초대 알림 모달 */}
      {inviteData && (
        <InviteResponseModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          inviter={inviteData.inviter}
          tripTitle={inviteData.tripTitle}
          startDate={inviteData.startDate}
          endDate={inviteData.endDate}
          location={inviteData.location}
          participants={inviteData.participants}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </Box>
  );
}

export default NotificationsPage;
