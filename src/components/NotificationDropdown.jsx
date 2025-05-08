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
  } from "@chakra-ui/react";
  import { FaBell } from "react-icons/fa";
  import { useEffect, useState } from "react";
  import InviteResponseModal from "./InviteResponseModal";
  import axios from "axios";
  
  function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const toast = useToast();
  
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          // 실제 API가 생기면 이 부분만 바꾸면 됨
          // const res = await axios.get("/notifications");
          // const data = Array.isArray(res.data) ? res.data : res.data.notifications;
  
          // 현재는 더미 데이터 사용
          const data = [
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
  
          setNotifications(data);
        } catch (err) {
          console.error("알림 불러오기 실패:", err);
          toast({
            title: "알림을 불러오지 못했습니다.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          setNotifications([]); // fallback
        }
      };
  
      fetchNotifications();
    }, []);
  
    const handleClick = async (noti) => {
      try {
        // 추후 실제 알림 읽음 처리 API 연결 예정
        // await axios.patch(`/notifications/${noti.id}/read`);
  
        if (noti.type === "invite") {
          setSelectedNotification(noti);
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
  
    return (
      <>
        <Menu>
          <MenuButton as={IconButton} icon={<FaBell />} aria-label="알림" position="relative">
            {notifications.length > 0 && (
              <Badge
                colorScheme="red"
                position="absolute"
                top="0"
                right="0"
                borderRadius="full"
                fontSize="xs"
                px="1"
              >
                {notifications.length}
              </Badge>
            )}
          </MenuButton>
          <MenuList minW="260px">
            <Box px={3} py={2}>
              <Text fontWeight="bold">🔔 최근 알림</Text>
            </Box>
            {Array.isArray(notifications) &&
              notifications.map((noti) => (
                <MenuItem key={noti.id} onClick={() => handleClick(noti)}>
                  {noti.message}
                </MenuItem>
              ))}
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
            inviter={selectedNotification.inviter}
            tripTitle={selectedNotification.tripTitle}
            startDate={selectedNotification.startDate}
            endDate={selectedNotification.endDate}
            location={selectedNotification.location}
            participants={selectedNotification.participants}
            onAccept={async (message) => {
              try {
                await axios.post("/invitations/accept", {
                  inviteId: selectedNotification.id,
                  message,
                });
                toast({
                  title: "초대를 수락했습니다.",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
                setSelectedNotification(null);
              } catch (err) {
                console.error("초대 수락 실패:", err);
                toast({
                  title: "수락 실패",
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                });
              }
            }}
            onDecline={async () => {
              try {
                await axios.post("/invitations/decline", {
                  inviteId: selectedNotification.id,
                });
                toast({
                  title: "초대를 거절했습니다.",
                  status: "info",
                  duration: 2000,
                  isClosable: true,
                });
                setSelectedNotification(null);
              } catch (err) {
                console.error("초대 거절 실패:", err);
                toast({
                  title: "거절 실패",
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
  