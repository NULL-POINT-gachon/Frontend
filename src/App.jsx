import React from "react";
import { useEffect } from "react";
import { initNotificationSystem } from './services/notificationService';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import {  Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CompleteProfilePage from "./pages/CompleteProfilePage"; 
import TravelInfoInput from "./pages/TravelInfoInput";
import MoodInput from "./pages/MoodInput";
import Summary from "./pages/Summary";
import MyPage from "./pages/MyPage";
import ProfilePage from "./pages/ProfilePage";
import AccountDeletePage from "./pages/AccountDeletePage";
import Result from "./pages/Result";
import PreferenceSurvey from "./pages/PreferenceSurvey";
import FinalRecommendation from "./pages/FinalRecommendation";
import RecommendedPlaceDetail from "./pages/RecommendedPlaceDetail";
import PlanRecommendationPage from "./pages/PlanRecommendationPage";
import BlankPanel from "./pages/BlankPanel";
import PlanDetailPanel from "./pages/PlanDetailPanel";
import MyPlanLayout from "./pages/MyPlanLayout";
import FinalRecommendationPage from "./pages/FinalRecommendationPage";
import PlanDetailPage from "./pages/PlanDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import MyPlanPage from "./pages/MyPlanPage";
import NotificationsPage from "./pages/NotificationsPage";
import HotDestinationDetail from "./pages/HotDestinationDetail";

import InviteResponsePage from "./pages/InviteResponsePage";

import AdminDashboard from "./components/admin/AdminDashboard";
import AdminHome from "./components/admin/AdminHome";
import AdminRoute from "./components/admin/AdminRoute";
import AdminNoticeList from "./components/admin/AdminNoticeList";
import AdminNoticeCreate from "./components/admin/AdminNoticeCreate";
import AdminNoticeEdit from "./components/admin/AdminNoticeEdit";
import AdminNoticeDetail from "./components/admin/AdminNoticeDetail";
import AdminQnaList from "./components/admin/AdminQnaList";
import AdminQnaDetail from "./components/admin/AdminQnaDetail";
import AdminUsers from "./components/admin/AdminUsers";
import AdminPlaces from "./components/admin/places/AdminPlaces";
import AdminPlaceDetail from "./components/admin/places/AdminPlaceDetail";
import AdminReviews from "./components/admin/AdminReviews";
import AdminReviewDetail from "./components/admin/AdminReviewDetail";
import AdminSchedules from "./components/admin/AdminSchedules";
import AdminAIPage from "./components/admin/AdminAIPage";
import AdminAccountSetting from "./components/admin/AdminAccountSetting";

import { TravelProvider } from "./contexts/TravelContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import axios from "axios";

// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:3000'; // 백엔드 서버 URL에 맞게 수정

// 요청 인터셉터 - 토큰 추가
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터 - 401 에러 처리
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 인증 오류 시 로그인 페이지로 리다이렉트
      if (window.location.pathname !== '/login') {
        // React Router 내부에서 이동하면 새로고침을 막을 수 있음
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);


function TokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      fetch('http://localhost:3000/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          login(data.data.name, token);
          navigate('/', { replace: true });
        }
      })
      .catch(error => console.error("프로필 조회 실패:", error));
    }
  }, [location, navigate, login]);
  
  return null;
}
function App() {
  useEffect(() => {
    initNotificationSystem();
  }, []);
  return (
    <ChakraProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <TravelProvider>
            <Routes>
              {/* 공개 라우트 */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/complete-profile" element={<CompleteProfilePage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="*" element={<TokenHandler />} />

              {/* 공통 레이아웃 적용 라우트 */}
              <Route element={<Layout />}>
                <Route
                  path="/survey/people"
                  element={<PrivateRoute><TravelInfoInput /></PrivateRoute>}
                />
                <Route
                  path="/start/mood"
                  element={<PrivateRoute><MoodInput /></PrivateRoute>}
                />
                <Route
                  path="/summary"
                  element={<PrivateRoute><Summary /></PrivateRoute>}
                />
                <Route
                  path="/result"
                  element={<PrivateRoute><Result /></PrivateRoute>}
                />
                <Route path="/preference" element={<PreferenceSurvey />} />
                <Route path="/final-recommendation" element={<FinalRecommendation />} />
                <Route path="/recommended-detail" element={<RecommendedPlaceDetail />} />

                <Route path="/hot-destinations/:id" element={<HotDestinationDetail />} />

              
              </Route>

              {/* 전체화면 라우트 */}
              <Route path="/plan" element={<PlanRecommendationPage />} />
              <Route path="/my-plan" element={<MyPlanLayout />}>
                <Route index element={<BlankPanel />} />          {/* /my-plan */}
                <Route path=":tripId" element={<PlanDetailPanel />} /> {/* /my-plan/24 */}
              </Route>
              <Route path="/final-recommendation-page" element={<FinalRecommendationPage />} />
              {/* ✅ 일정 리스트 페이지 */}
              <Route path="/my-plan" element={<MyPlanPage />} />

                {/* ✅ 일정 상세 페이지 – tripId 숫자 사용 */}
                <Route path="/my-plan/:tripId" element={<PlanDetailPage />} />

                <Route
                  path="/mypage"
                  element={<PrivateRoute><MyPage /></PrivateRoute>}
                />
                <Route
                  path="/mypage/profile"
                  element={<PrivateRoute><ProfilePage /></PrivateRoute>}
                />
                <Route
                  path="/mypage/delete"
                  element={<PrivateRoute><AccountDeletePage /></PrivateRoute>}
                />
                <Route path="/notifications" element={<NotificationsPage />} />
                
                <Route path="/invite/:shareId" element={<InviteResponsePage />} />
             

              {/* 관리자 전용 라우트 */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminDashboard />}>
                  <Route index element={<AdminHome />} />
                  <Route path="notices" element={<AdminNoticeList />} />
                  <Route path="notices/new" element={<AdminNoticeCreate />} />
                  <Route path="notices/:id/edit" element={<AdminNoticeEdit />} />
                  <Route path="notices/:id" element={<AdminNoticeDetail />} />
                  <Route path="qna" element={<AdminQnaList />} />
                  <Route path="qna/:id" element={<AdminQnaDetail />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="places" element={<AdminPlaces />} />
                  <Route path="places/:id" element={<AdminPlaceDetail />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="reviews/:id" element={<AdminReviewDetail />} />
                  <Route path="schedules" element={<AdminSchedules />} />
                  <Route path="ai" element={<AdminAIPage />} />
                  <Route path="account" element={<AdminAccountSetting />} />
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
