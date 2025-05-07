import React, { createContext, useContext, useEffect, useState } from "react";

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  // localStorage 복원
  const [travelData, setTravelData] = useState(() => {
    const saved = localStorage.getItem("travelData");
    return saved
      ? JSON.parse(saved)
      : {
          dateRange: [],
          people: null,
          moods: [],
          selectedCity: null,
          preference: null,
        };
  });

  // 직렬화
  useEffect(() => {
    localStorage.setItem("travelData", JSON.stringify(travelData));
  }, [travelData]);

  return (
    <TravelContext.Provider value={{ travelData, setTravelData }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => useContext(TravelContext);