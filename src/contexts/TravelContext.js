import { createContext, useContext, useState } from "react";

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [travelData, setTravelData] = useState({
    dateRange: [],
    people: null,
    moods: [],
  });

  return (
    <TravelContext.Provider value={{ travelData, setTravelData }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => useContext(TravelContext);
