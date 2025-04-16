import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TravelInfoInput from "./pages/TravelInfoInput";
import MoodInput from "./pages/MoodInput";
import Summary from "./pages/Summary";      
import ResultPage from "./pages/ResultPage";

import { AuthProvider } from "./contexts/AuthContext";
import { TravelProvider } from "./contexts/TravelContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <TravelProvider>
          <Routes>
            {/* 공개 경로 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* 설문 단계 (보호된 경로) */}
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
              path="/start/result"
              element={
                <PrivateRoute>
                  <ResultPage />
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
