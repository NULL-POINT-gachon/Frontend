import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TravelInfoInput from "./pages/TravelInfoInput";
import MoodInput from "./pages/MoodInput";
import Summary from "./pages/Summary";
import MyPage from "./pages/MyPage";
import ProfilePage from "./pages/ProfilePage";
import AccountDeletePage from "./pages/AccountDeletePage";
import Result from "./pages/Result";
import PreferenceSurvey from "./pages/PreferenceSurvey";
import FinalRecommendation from "./pages/FinalRecommendation";
import HotDestinationDetail from "./pages/HotDestinationDetail";
import PlanRecommendationPage from "./pages/PlanRecommendationPage";
import FinalRecommendationPage from "./pages/FinalRecommendationPage";

import PlanDetailPage from "./pages/PlanDetailPage"; 


import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminHome from "./components/admin/AdminHome";
import AdminRoute from "./components/admin/AdminRoute";


import { TravelProvider } from "./contexts/TravelContext";
import { AuthProvider } from "./contexts/AuthContext";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <AdminAuthProvider>
        <TravelProvider>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route element={<Layout />}>
              <Route
                path="/survey/people"
                element={
                  <PrivateRoute>
                    <TravelInfoInput />
                  </PrivateRoute>
                }
              />
              <Route
                path="/start/mood"
                element={
                  <PrivateRoute>
                    <MoodInput />
                  </PrivateRoute>
                }
              />
              <Route
                path="/summary"
                element={
                  <PrivateRoute>
                    <Summary />
                  </PrivateRoute>
                }
              />

              <Route
                path="/result"
                element={
                  <PrivateRoute>
                    <Result />
                  </PrivateRoute>
                }
              />

              <Route
              path="/preference"
              element={
                <PreferenceSurvey/>
              }
              />

              <Route
              path="/final-recommendation"
              element={
                <FinalRecommendation/>
              }
              />

              <Route
              path="hot-destinations/:id"
              element={
                <HotDestinationDetail/>
              }
              />



    
            </Route>

            {/* 레이아웃 없이 넓게 써야 하는 페이지는 Layout 밖에 배치 */}
            <Route path="/plan" element={<PlanRecommendationPage />} />
            <Route path="/final-recommendation-page" element={<FinalRecommendationPage />} />
            <Route
                path="/mypage"
                element={
                  <PrivateRoute>
                    <MyPage />
                  </PrivateRoute>
                }
              />

<Route path="/mypage/profile" element={<PrivateRoute><ProfilePage /> </PrivateRoute>}/>
              <Route
                path="/mypage/delete"
                element={
                  <PrivateRoute>
                    <AccountDeletePage />
                  </PrivateRoute>
                }
              />

              
<Route
  path="/plan/:region"
  element={
    <PrivateRoute>
      <PlanDetailPage />
    </PrivateRoute>
  }
/>
<Route path="/admin/login" element={<AdminLoginPage />} />
<Route
            path="/admin"
            element={<AdminRoute />}
          >
            <Route element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            </Route>
            </Route>

          </Routes>
          
        </TravelProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
