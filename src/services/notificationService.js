// src/services/notificationService.js
import axios from 'axios';

// 마지막으로 확인한 알림 ID
let latestNotificationId = 0;

// 브라우저 알림 표시
export const showBrowserNotification = (notification) => {
  if (Notification.permission !== "granted") return;
  
  const typeEmojis = {
    invite: "🤝",
    update: "📝",
    comment: "💬", 
    place_added: "📍",
    place_removed: "🗑️",
    travel_upcoming: "🗓️",
  };
  
  const emoji = typeEmojis[notification.type] || "🔔";
  const title = `${emoji} 새 알림`;
  
  const browserNotification = new Notification(title, {
    body: notification.message,
    icon: "/images/logo.png", 
  });
  
  browserNotification.onclick = () => {
    if (notification.trip_id) {
      window.location.href = `/trip/${notification.trip_id}`;
    } else {
      window.focus();
    }
    browserNotification.close();
  };
};

// 새 알림 확인
export const checkForNewNotifications = async () => {
  try {
    const response = await axios.get("/notifications?limit=1");
    const notifications = response.data.data.notifications || [];
    
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      // 처음 로드가 아니고, 새 알림이 있는 경우
      if (latestNotificationId > 0 && latestNotification.id > latestNotificationId) {
        showBrowserNotification(latestNotification);
      }
      
      // 최신 알림 ID 업데이트
      if (latestNotification.id > latestNotificationId) {
        latestNotificationId = latestNotification.id;
      }
    }
  } catch (error) {
    console.error("새 알림 확인 실패:", error);
  }
};

// 알림 권한 요청
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("이 브라우저는 알림을 지원하지 않습니다.");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
};

// 알림 시스템 초기화
export const initNotificationSystem = async () => {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    // 초기 알림 ID 설정
    try {
      const response = await axios.get("/notifications?limit=1");
      const notifications = response.data.data.notifications || [];
      
      if (notifications.length > 0) {
        latestNotificationId = notifications[0].id;
      }
    } catch (error) {
      console.error("초기 알림 ID 설정 실패:", error);
    }
    
    // 30초마다 새 알림 확인
    setInterval(checkForNewNotifications, 30000);
  }
};