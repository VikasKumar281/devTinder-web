// import { Outlet, useNavigate } from "react-router-dom";
// import NavBar from "./NavBar";
// import Footer from "./Footer";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { BASE_URL } from "../utils/constants";
// import { addUser } from "../utils/userSlice";
// import { useEffect } from "react";

// const Body = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const userData = useSelector((store) => store.user);

//   // const fetchUser = async () => {
//   //   if (userData) return;

//   //   try {
//   //     const res = await axios.get(`${BASE_URL}/profile/view`, {
//   //       withCredentials: true,
//   //     });
//   //     dispatch(addUser(res.data));
//   //   } catch (err) {
//   //     if (err?.response?.status === 401) {
//   //       navigate("/login");
//   //     }
//   //     console.error(err);
//   //   }
//   // };

//   const fetchUser = async () => {
//     if (userData && userData.firstName) return;

//     try {
//       const res = await axios.get(`${BASE_URL}/profile/view`, {
//         withCredentials: true,
//       });
//       dispatch(addUser(res.data));
//     } catch (err) {
//       console.log(err);
//       navigate("/login");
//     }
//   };

//   // useEffect(() => {
//   //   fetchUser();
//   // }, []);

//   useEffect(() => {
//   fetchUser();
// }, [userData]);

//   return (
//     <div>
//       <NavBar />
//       <Outlet />
//       <Footer />
//     </div>
//   );
// };

// export default Body;



import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
          timeout: 8000,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        console.log(err);
        navigate("/login");
      } finally {
        setAuthChecked(true);
      }
    };

    if (!user) {
      checkAuth();
    } else {
      setAuthChecked(true);
    }
  }, [user, dispatch, navigate]);

  // ⛔ Jab tak auth decide na ho, kuch render hi mat karo
  if (!authChecked) return <PageLoader label="Loading DevTinder" />;

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

export default Body;
