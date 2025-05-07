import React, { createContext, useState } from "react";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 비동기 로그인 함수 (Promise로 감싸기)
  const login = async (username, password) => {
    return new Promise((resolve) => {
      // 나중에 여기를 axios 요청으로 교체하면 됨
      if (username === "admin" && password === "admin123") {
        setIsAdminLoggedIn(true);
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
    });
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
