import { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setLocation(savedLocation);
    } else {
      // Show popup after a slight delay if location is not set
      setTimeout(() => setShowPopup(true), 1500);
    }
  }, []);

  const saveLocation = (loc) => {
    setLocation(loc);
    localStorage.setItem("userLocation", loc);
    setShowPopup(false);
  };

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem("userLocation");
    setShowPopup(true);
  };

  return (
    <LocationContext.Provider value={{ location, showPopup, setShowPopup, saveLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
