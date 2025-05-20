import React from "react";
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
import { useEffect, useState } from "react";
import InviteResponseModal from "./InviteResponseModal";
import axios from "axios";

// 알림 타입별 이모지 맵핑
const typeEmojis = {
  invite: "🤝",
  update: "📝",
  comment: "💬", 
  place_added: "📍",
  place_removed: "🗑️",
  travel_upcoming: "🗓️",
};

// 상대적 시간 표시 함수
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

function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const toast = useToast();

  // 알림 목록 가져오기 
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // 백엔드 API 호출 (path: /notifications)
      const response = await axios.get("/notifications?limit=5");
      
      // 응답 구조에 맞게 데이터 추출
      const notificationsData = response.data.data.notifications || [];
      const unreadCountData = response.data.data.unreadCount || 0;
      
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

  // 컴포넌트 마운트 시 알림 목록 가져오기
  useEffect(() => {
    fetchNotifications();
    
    // 30초마다 알림 목록 갱신
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // 알림 항목 클릭 핸들러
  const handleClick = async (noti) => {
    try {
      // 읽지 않은 알림인 경우 읽음 처리
      if (!noti.is_read) {
        // 백엔드 API 호출 (path: /notifications/{notificationId}/read)
        await axios.patch(`/notifications/${noti.id}/read`);
        
        // 상태 업데이트
        setNotifications(notifications.map(n => 
          n.id === noti.id ? {...n, is_read: true} : n
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }

      // 알림 타입별 처리
      if (noti.type === "invite") {
        // 초대 알림은 모달로 처리
        setSelectedNotification(noti);
      } else if (noti.trip_id) {
        // 여행 일정 관련 알림은 해당 일정 페이지로 이동
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

  // 모든 알림 읽음 처리
  const markAllAsRead = async () => {
    try {
      // 백엔드 API 호출 (path: /notifications/read-all)
      await axios.patch("/notifications/read-all");
      
      // 상태 업데이트
      setNotifications(notifications.map(n => ({...n, is_read: true})));
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

  return (
    <>
      <Menu>
        <MenuButton 
          as={IconButton} 
          icon={<FaBell />} 
          aria-label="알림" 
          position="relative"
          variant="ghost"
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
              <Text mt={2} color="gray.500">알림 불러오는 중...</Text>
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

      {/* 초대 모달 */}
      {selectedNotification && (
        <InviteResponseModal
          isOpen={true}
          onClose={() => setSelectedNotification(null)}
          // 백엔드 응답 구조에 맞게 속성 매핑
          inviter={selectedNotification.sender_name}
          tripTitle={selectedNotification.trip_title}
          startDate={selectedNotification.start_date}
          endDate={selectedNotification.end_date}
          location={selectedNotification.location}
          participants={selectedNotification.participants || []}
          onAccept={async (message) => {
            try {
              // 백엔드 API 호출 (path: /trip/share/respond)
              await axios.post("/trip/share/respond", {
                token: selectedNotification.id, // 또는 selectedNotification이 shareId를 가지고 있다면 해당 값 사용
                action: "accepted",
                message
              });
              
              toast({
                title: "초대를 수락했습니다.",
                status: "success",
                duration: 2000,
                isClosable: true,
              });
              
              setSelectedNotification(null);
              fetchNotifications(); // 알림 목록 갱신
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
              // 백엔드 API 호출 (path: /trip/share/respond)
              await axios.post("/trip/share/respond", {
                token: selectedNotification.id, // 또는 selectedNotification이 shareId를 가지고 있다면 해당 값 사용
                action: "rejected"
              });
              
              toast({
                title: "초대를 거절했습니다.",
                status: "info",
                duration: 2000,
                isClosable: true,
              });
              
              setSelectedNotification(null);
              fetchNotifications(); // 알림 목록 갱신
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

export default NotificationDropdown;