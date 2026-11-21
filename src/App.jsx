import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Body from "./components/Body";
import AuthLayout from "./components/AuthLayout";
import SplashScreen from "./components/SplashScreen";

const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("./components/Profile"));
const Feed = lazy(() => import("./components/Feed"));
const Connections = lazy(() => import("./components/Connections"));
const Requests = lazy(() => import("./components/Requests"));
const Chat = lazy(() => import("./components/Chat"));
const ViewUser = lazy(() => import("./components/ViewUser"));
const Support = lazy(() => import("./components/Support"));
const Contact = lazy(() => import("./components/Contact"));


// function App() {
//   return (
//     <>
//       <Provider store ={appStore}>
//        <BrowserRouter basename="/">
//          <Routes>
//             <Route path ="/" element = {<Body />}>
//                <Route path ="/" element = {<Feed />}/>
//                <Route path ="/login" element = {<Login />}/>
//                <Route path ="/profile" element = {<Profile />}/>
//                <Route path ="/connections" element = {<Connections />}/>
//                <Route path ="/requests" element = {<Requests />}/>
//                <Route path ="/chat/:targetUserId" element = {<Chat />}/>
//             </Route>
//          </Routes>
//        </BrowserRouter>
//       </Provider> 
//     </> 
//   );
// }

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Suspense fallback={<SplashScreen />}>
        <Routes>

          {/* PUBLIC — site URL opens login immediately */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
          </Route>


          {/* PROTECTED */}
          <Route element={<Body />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
            <Route path="user/:userId" element={<ViewUser />} />
            <Route path="chat/:targetUserId" element={<Chat />} />
          </Route>

        </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;



