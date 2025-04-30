import React from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"; 
import { TravelProvider } from "./contexts/TravelContext";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import MyPage from "./pages/MyPage";
import ProfilePage from "./pages/ProfilePage";
import AccountDeletePage from "./pages/AccountDeletePage";


function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <TravelProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} /> 
            
            {/* 보호된 경로 */}
            <Route
              path="/mypage"
              element={
                <PrivateRoute>
                  <MyPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/mypage/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/mypage/delete"
              element={
                <PrivateRoute>
                  <AccountDeletePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </TravelProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
