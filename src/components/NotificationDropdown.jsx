import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  Badge,
  Text,
  useToast,
  Flex,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import InviteResponseModal from "./InviteResponseModal";
import { useAuth } from "../contexts/AuthContext";

/* 알림 타입 → 이모지 */
const typeEmojis = {
  invite: "🤝",
  update: "📝",
  comment: "💬",
  place_added: "📍",
  place_removed: "🗑️",
  travel_upcoming: "🗓️",
};

/* 상대 시간 변환 */
const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "방금 전";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString();
};

export default function NotificationDropdown() {
  /* ---------- 인증 토큰 ---------- */
  const { token } = useAuth();

  /* ---------- 상태 ---------- */
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const toast = useToast();

  /* ---------- 알림 목록 불러오기 ---------- */
  const fetchNotifications = async () => {
    if (!token) return;                 // 로그인 전이면 패스
    setIsLoading(true);
    try {
      const { data } = await axios.get("/trip/share/invites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notificationsData = data.notifications || [];
      const unreadCountData = data.unreadCount || 0;

      console.log(" <<< notificationsData >>> ",notificationsData);
      console.log(" <<< unreadCountData >>> ",unreadCountData);

      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (err) {
      console.error("알림 불러오기 실패:", err);
      toast({
        title: "알림을 불러오지 못했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- 최초 마운트 & 30초 polling ---------- */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  /* ---------- 알림 클릭 ---------- */
  const handleClick = async (noti) => {
    try {
      

      /* ② 타입별 행동 */
      if (noti.type === "invite") {
        setSelectedNotification(noti);               // 초대 모달 오픈
      } else if (noti.trip_id) {
        window.location.href = `/trip/${noti.trip_id}`;
      } else {
        toast({
          title: "알림을 확인했습니다.",
          status: "info",
          duration: 1500,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("알림 처리 실패:", err);
      toast({
        title: "알림 처리 중 오류가 발생했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  /* ---------- 전체 읽음 ---------- */
  const markAllAsRead = async () => {
    try {
      await axios.patch(
        "/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast({
        title: "모든 알림을 읽음 처리했습니다.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error("읽음 처리 실패:", err);
      toast({
        title: "읽음 처리 중 오류가 발생했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  /* ---------- JSX ---------- */
  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FaBell />}
          aria-label="알림"
          position="relative"
          variant="ghost"
          onClick={fetchNotifications}   /* 메뉴 열 때 갱신 */
        >
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              position="absolute"
              top="0"
              right="0"
              borderRadius="full"
              fontSize="xs"
              px="1"
            >
              {unreadCount}
            </Badge>
          )}
        </MenuButton>

        <MenuList minW="320px" maxH="500px" overflowY="auto">
          <Flex px={3} py={2} justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">🔔 최근 알림</Text>
            {unreadCount > 0 && (
              <Button size="xs" onClick={markAllAsRead}>
                모두 읽음
              </Button>
            )}
          </Flex>

          <Divider />

          {isLoading ? (
            <Box py={4} textAlign="center">
              <Spinner size="sm" />
              <Text mt={2} color="gray.500">
                알림 불러오는 중...
              </Text>
            </Box>
          ) : notifications.length === 0 ? (
            <Box py={4} textAlign="center">
              <Text color="gray.500">알림이 없습니다.</Text>
            </Box>
          ) : (
            notifications.map((noti) => (
              <MenuItem
                key={noti.id}
                onClick={() => handleClick(noti)}
                bg={noti.is_read ? "white" : "blue.50"}
                py={3}
                _hover={{ bg: "blue.100" }}
              >
                <Flex alignItems="flex-start">
                  <Text mr={2} fontSize="lg">
                    {typeEmojis[noti.type] || "🔔"}
                  </Text>
                  <Box>
                    <Text fontWeight={noti.is_read ? "normal" : "bold"}>
                      {noti.message}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {timeAgo(noti.created_at)}
                    </Text>
                  </Box>
                </Flex>
              </MenuItem>
            ))
          )}

          <Divider />

          <MenuItem as="a" href="/notifications" color="blue.500">
            전체 알림 보기 →
          </MenuItem>
        </MenuList>
      </Menu>

      {/* ---------- 초대 응답 모달 ---------- */}
      {selectedNotification && (
        <InviteResponseModal
          isOpen={true}
          onClose={() => setSelectedNotification(null)}
          senderName={selectedNotification.sender_name}
          tripTitle={selectedNotification.trip_title}
          startDate={selectedNotification.start_date}
          endDate={selectedNotification.end_date}
          shareId={selectedNotification.id}
          location={selectedNotification.location}
          participants={selectedNotification.participants || []}
          onAccept={async (message) => {
            try {
              console.log(" <<< selectedNotification >>> ",selectedNotification);
              await axios.post(
                "/trip/share/respond",
                {
                  shareId: selectedNotification.id,
                  action: "accepted",
                  message,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              toast({
                title: "초대를 수락했습니다.",
                status: "success",
                duration: 2000,
                isClosable: true,
              });
              setSelectedNotification(null);
              fetchNotifications();
            } catch (err) {
              console.error("초대 수락 실패:", err);
              toast({
                title: "초대 수락 중 오류가 발생했습니다.",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
            }
          }}
          onDecline={async () => {
            try {
              await axios.post(
                "/trip/share/respond",
                {
                  shareId: selectedNotification.id,
                  action: "rejected",
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              toast({
                title: "초대를 거절했습니다.",
                status: "info",
                duration: 2000,
                isClosable: true,
              });
              setSelectedNotification(null);
              fetchNotifications();
            } catch (err) {
              console.error("초대 거절 실패:", err);
              toast({
                title: "초대 거절 중 오류가 발생했습니다.",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
            }
          }}
        />
      )}
    </>
  );
}
