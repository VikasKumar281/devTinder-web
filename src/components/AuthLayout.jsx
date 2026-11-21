import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user) return;
    axios
      .get(`${BASE_URL}/profile/view`, { withCredentials: true, timeout: 8000 })
      .then((res) => dispatch(addUser(res.data)))
      .catch(() => {});
  }, [user, dispatch]);

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
