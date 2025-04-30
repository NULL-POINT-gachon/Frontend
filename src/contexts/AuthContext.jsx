import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const login = (name) => {
    setIsLoggedIn(true);
    setUsername(name);
    // localStorage.setItem("username", name); → 제거됨
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    // localStorage.removeItem("username"); → 제거됨
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
