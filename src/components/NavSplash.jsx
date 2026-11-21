import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SplashScreen from "./SplashScreen";

const NavSplashContext = createContext({ trigger: () => {} });

export const useNavSplash = () => useContext(NavSplashContext);

export const NavSplashProvider = ({ children }) => {
  const location = useLocation();
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);
  const timers = useRef([]);

  const trigger = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setShow(true);
    setFading(false);
    timers.current = [
      setTimeout(() => setFading(true), 1400),
      setTimeout(() => setShow(false), 2000),
    ];
  }, []);

  useEffect(() => {
    trigger();
    return () => timers.current.forEach(clearTimeout);
  }, [location.pathname, trigger]);

  return (
    <NavSplashContext.Provider value={{ trigger }}>
      {children}
      {show && <SplashScreen fading={fading} />}
    </NavSplashContext.Provider>
  );
};
