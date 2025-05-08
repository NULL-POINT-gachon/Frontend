import React, { createContext, useState } from "react";
import axios from "axios";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // 비동기 로그인 함수 (Promise로 감싸기)
  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email: username,
        password: password
      });

      // 백엔드에서 반환된 데이터에서 role 확인
      if (response.data.success && response.data.data?.user?.role === "admin") {
        // 관리자라면 로그인 처리
        setIsAdminLoggedIn(true);
        localStorage.setItem("token", response.data.data.token); // adminToken에서 token으로 변경
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`; // 토큰 경로 수정
        return { success: true };
      } else {
        setError("관리자 권한이 필요합니다.");
        return { success: false, message: "관리자 권한이 필요합니다." };
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setError("로그인 중 오류가 발생했습니다.");
      return { success: false, message: "로그인 중 오류가 발생했습니다." };
    }
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("token"); // adminToken에서 token으로 변경
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
};