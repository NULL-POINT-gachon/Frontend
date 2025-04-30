// src/App.jsx
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import HomePage from "./pages/HomePage";
import { TravelProvider } from "./contexts/TravelContext"; 

function App() {
  return (
    <ChakraProvider>
      <TravelProvider>
        <HomePage />
      </TravelProvider>
    </ChakraProvider>
  );
}

export default App;
