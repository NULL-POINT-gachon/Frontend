import React from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"; 
import { TravelProvider } from "./contexts/TravelContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <TravelProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} /> 
          </Routes>
        </TravelProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
