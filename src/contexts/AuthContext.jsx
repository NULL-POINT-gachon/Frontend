import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  /* 1️⃣  렌더 전에 localStorage 값을 읽어 초기화 */
  const [token,     setToken]     = useState(() => localStorage.getItem("token") || "");
  const [username,  setUsername]  = useState(() => localStorage.getItem("username") || "");
  const [isLoggedIn,setIsLoggedIn]= useState(() => !!localStorage.getItem("token"));

  /* 2️⃣  토큰 상태가 바뀔 때마다 Axios 헤더 자동 세팅 */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /* 3️⃣  이메일 / 비밀번호 로그인 */
  const loginWithCredentials = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:3000/user/login", { email, password });

      if (!data.success) throw new Error(data.message || "로그인 실패");
      const { token: authToken, user } = data.data;

      login(user.name, authToken);
      return { success: true };
    } catch (err) {
      console.error("로그인 오류:", err);
      return { success:false, error: err.response?.data?.message || err.message };
    }
  };

  /* 4️⃣  공통 로그인 처리 */
  const login = (name, authToken) => {
    setUsername(name);
    setToken(authToken);
    setIsLoggedIn(true);

    localStorage.setItem("username", name);        // ✅ 오타 수정
    localStorage.setItem("token",    authToken);
  };

  /* 5️⃣  로그아웃 */
  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setToken("");

    localStorage.removeItem("username");
    localStorage.removeItem("token");
  };

  /* 6️⃣  프로필 추가 저장 (Google OAuth 등) */
  const completeProfile = async (payload) => {
    try {
      const { data } = await axios.post("http://localhost:3000/user/complete-profile", payload);
      if (!data.success) throw new Error(data.message || "프로필 저장 실패");
      const { token: authToken, user } = data.data;

      login(user.name, authToken);
      return { success: true };
    } catch (err) {
      return { success:false, error: err.response?.data?.message || err.message };
    }
  };

  const getToken  = () => token;
  const checkToken= () => !!token;

  return (
    <AuthContext.Provider value={{
      isLoggedIn, username, token,
      login, logout,
      loginWithCredentials,
      completeProfile,
      getToken, checkToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
