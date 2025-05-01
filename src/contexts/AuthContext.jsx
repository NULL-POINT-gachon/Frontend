import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  // 앱 시작할 때 localStorage에서 로그인 정보 복원
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedToken = localStorage.getItem("token");
    
    if (savedUsername && savedToken) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
      setToken(savedToken);
      
      // axios 기본 헤더 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);
  
  // 토큰 가져오기 함수 (전역에 선언)
  const getToken = () => localStorage.getItem("token");

  // 실제 백엔드 API로 로그인 요청을 보내는 함수
  const loginWithCredentials = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password
      });
      
      console.log("로그인 응답:", response.data);
      
      if (response.data.success) {
        const userData = response.data.data;
        const authToken = userData.token;
        const userName = userData.user.name;
        
        login(userName, authToken);
        return { success: true };
      } else {
        throw new Error(response.data.message || "로그인에 실패했습니다");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "로그인 중 오류가 발생했습니다" 
      };
    }
  };
  
  // 기존 로그인 함수 (토큰 관리 추가)
  const login = (name, authToken) => {
    setIsLoggedIn(true);
    setUsername(name);
    localStorage.setItem("username", name);
    
    if (authToken) {
      setToken(authToken);
      localStorage.setItem("token", authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setToken("");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common['Authorization'];
  };

  // 토큰이 유효한지 확인
  const checkToken = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      token,
      login, 
      logout, 
      loginWithCredentials,
      getToken,
      checkToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}