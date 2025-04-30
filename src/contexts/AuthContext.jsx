import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // 앱 시작할 때 localStorage에서 로그인 정보 복원
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  const login = (name) => {
    setIsLoggedIn(true);
    setUsername(name);
    localStorage.setItem("username", name); // 로그인 성공 시 저장
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("username"); // 로그아웃 시 삭제
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
