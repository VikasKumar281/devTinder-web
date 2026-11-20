import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
import AuthLayout from "./components/AuthLayout";


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
        <Routes>

          {/* PUBLIC — site URL opens login immediately */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
          </Route>


          {/* PROTECTED */}
          <Route element={<Body />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
            <Route path="chat/:targetUserId" element={<Chat />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;



