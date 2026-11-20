import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="page-fade flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
