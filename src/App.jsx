import { Routes, Route } from "react-router-dom";
import { TravelProvider } from "./contexts/TravelContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TravelInfoInput from "./pages/TravelInfoInput";
import MoodInput from "./pages/MoodInput";
import Summary from "./pages/Summary";
import Result from "./pages/Result";
import RouteAnalysisPage from './pages/RouteAnalysisPage';
import PlanRecommendationPage from './pages/PlanRecommendationPage';
import MyPlanPage from "./pages/MyPlanPage";
import MyPage from "./pages/MyPage";
import ProfilePage from "./pages/ProfilePage";
import AccountPage from "./pages/AccountPage";
import NotificationPage from "./pages/NotificationPage";
import AccountDeletePage from "./pages/AccountDeletePage";
import HotDestinationDetail from "./pages/HotDestinationDetail";
import TravelCardList from "./components/TravelCardList";
import PlanDetailPage from "./pages/PlanDetailPage";
import InvitationPage from "./pages/InvitationPage";
import NotificationsPage from "./pages/NotificationsPage";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminHome from "./components/admin/AdminHome";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminRoute from "./components/admin/AdminRoute";
import AdminUsers from "./components/admin/AdminUsers";
import AdminPlaces from "./components/admin/AdminPlaces";
import AdminPlaceDetail from "./components/admin/AdminPlaceDetail";
import AdminReviews from "./components/admin/AdminReviews";
import AdminReviewDetail from "./components/admin/AdminReviewDetail";
import AdminSchedules from "./components/admin/AdminSchedules";
import AdminAccountSetting from "./components/admin/AdminAccountSetting";
import AdminNoticeList from "./components/admin/AdminNoticeList";
import AdminNoticeCreate from "./components/admin/AdminNoticeCreate";
import AdminNoticeEdit from "./components/admin/AdminNoticeEdit";
import AdminNoticeDetail from "./components/admin/AdminNoticeDetail";
import AdminQnaList from "./components/admin/AdminQnaList";
import AdminQnaDetail from "./components/admin/AdminQnaDetail";
import AdminAIPage from "./components/admin/AdminAIPage";

import PreferenceSurvey from "./pages/PreferenceSurvey";
import FinalRecommendation from "./pages/FinalRecommendation";
import FinalRecommendationPage from "./pages/FinalRecommendationPage";

import SurveyLayout from "./components/SurveyLayout";

function App() {
  return (
    <TravelProvider>
      <AdminAuthProvider>
        <Routes>
          {/* 사용자 기본 경로 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* 설문 */}
          <Route path="/start" element={<SurveyLayout><TravelInfoInput /></SurveyLayout>} />
          <Route path="/start/mood" element={<SurveyLayout><MoodInput /></SurveyLayout>} />
          <Route path="/summary" element={<SurveyLayout><Summary /></SurveyLayout>} />
          <Route path="/result" element={<SurveyLayout><Result /></SurveyLayout>} />
          <Route path="/preference" element={<SurveyLayout><PreferenceSurvey /></SurveyLayout>} />
          <Route path="/final-recommendation" element={<SurveyLayout><FinalRecommendation /></SurveyLayout>} />

          {/* 주요 기능 */}
          <Route path="/route-analysis" element={<RouteAnalysisPage />} />
          <Route path="/plan" element={<PlanRecommendationPage />} />
          <Route path="/my-plan" element={<MyPlanPage />} />

          {/* 마이페이지 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/profile" element={<ProfilePage />} />
          <Route path="/mypage/account" element={<AccountPage />} />
          <Route path="/mypage/notification" element={<NotificationPage />} />
          <Route path="/mypage/delete" element={<AccountDeletePage />} />

          {/* 여행지 */}
          <Route path="/hot-destinations" element={<TravelCardList />} />
          <Route path="/hot-destinations/:id" element={<HotDestinationDetail />} />
          <Route path="/plan/:region" element={<PlanDetailPage />} />
          <Route path="/final-recommendation-page" element={<FinalRecommendationPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* 초대 */}
          <Route path="/invite/:inviteId" element={<InvitationPage />} />

          {/* 관리자 로그인 */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ✅ 관리자 대시보드 및 하위 라우터 */}
          <Route
            path="/admin"
            element={<AdminRoute />}
          >
            <Route element={<AdminDashboard />}>
              {/* ✅ index는 하나만! */}
              <Route index element={<AdminHome />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="places" element={<AdminPlaces />} />
              <Route path="places/:id" element={<AdminPlaceDetail />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="reviews/:id" element={<AdminReviewDetail />} />
              <Route path="schedules" element={<AdminSchedules />} />
              <Route path="account" element={<AdminAccountSetting />} />
              <Route path="notices" element={<AdminNoticeList />} />
              <Route path="notices/new" element={<AdminNoticeCreate />} />
              <Route path="notices/:id/edit" element={<AdminNoticeEdit />} />
              <Route path="notices/:id" element={<AdminNoticeDetail />} />
              <Route path="qna" element={<AdminQnaList />} />
              <Route path="qna/:id" element={<AdminQnaDetail />} />
              <Route path="ai" element={<AdminAIPage />} />
            </Route>
          </Route>
        </Routes>
      </AdminAuthProvider>
    </TravelProvider>
  );
}

export default App;
