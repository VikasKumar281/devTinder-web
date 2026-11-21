import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import SplashScreen from "./SplashScreen";

const AuthLayout = () => {
  const [splash, setSplash] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1700);
    const hideTimer = setTimeout(() => setSplash(false), 2300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {splash && <SplashScreen fading={fading} />}
      <NavBar />
      <main className="page-fade flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
