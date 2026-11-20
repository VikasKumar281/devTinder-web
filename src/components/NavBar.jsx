import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";


const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const itemClass = (path) =>
    `rounded-xl ${location.pathname === path ? "bg-primary/15 text-primary" : ""}`;

  useEffect(() => {
    const name = searchText.trim();
    if (!user || name.length === 0) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          BASE_URL + "/user/search?name=" + encodeURIComponent(name),
          { withCredentials: true }
        );
        setSearchResults(res.data.data || []);
      } catch (err) {
        setSearchResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchText, user]);

  const openProfile = (userId) => {
    setSearchText("");
    setSearchResults([]);
    navigate("/user/" + userId);
  };

  const handleLogout = async () => {
      try{
        await axios.post(
          BASE_URL + "/logout" ,
          {},
          {withCredentials: true}
        );
        dispatch(removeUser());
        dispatch(clearFeed());
        return navigate("/login");
      }
      catch(err){
       //Error Logic maybe redirect to error page
       console.error(err);
      }
  }

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-base-300/90 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-3 sm:px-6">
      <Link to={user ? "/feed" : "/"} className="btn btn-ghost px-2 text-lg font-semibold gap-2">
        <img src="/Logo.png" alt="DevTinder" className="h-8 w-8 rounded-lg object-cover" />
        <span className="hidden sm:inline">DevTinder</span>
      </Link>
      {user ? (
        <div className="relative mx-auto w-full max-w-md">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search developers"
            className="input input-sm h-10 w-full rounded-full border-white/10 bg-base-100 px-4"
          />
          {searchText.trim() && (
            <div className="absolute left-0 right-0 top-12 z-30 max-h-80 overflow-auto rounded-2xl border border-white/10 bg-base-200 p-2 shadow-2xl">
              {searchResults.length === 0 ? (
                <p className="px-3 py-2 text-sm opacity-60">No users found</p>
              ) : (
                searchResults.map((person) => (
                  <button
                    key={person._id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-base-300"
                    onClick={() => openProfile(person._id)}
                  >
                    <img
                      src={person.photoUrl || "/Logo.png"}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {person.firstName} {person.lastName}
                      </span>
                      {person.skills?.length > 0 && (
                        <span className="block truncate text-xs opacity-60">{person.skills.slice(0, 2).join(" · ")}</span>
                      )}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div />
      )}
      {user && (
        <div className="flex items-center gap-2">
          <span className="hidden text-sm opacity-80 md:block">{user.firstName}</span>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring-2 ring-primary/40">
                <img alt="user photo" src={user?.photoUrl || "/Logo.png"} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[20] mt-3 w-60 rounded-2xl border border-white/10 bg-base-200 p-2 shadow-2xl"
            >
              <li className="pointer-events-none px-3 py-2">
                <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                <p className="truncate text-xs opacity-60">{user.emailId}</p>
              </li>
              <div className="my-1 h-px bg-white/10" />
              <li><Link to="/profile" className={itemClass("/profile")}>Profile</Link></li>
              <li><Link to="/connections" className={itemClass("/connections")}>Connections</Link></li>
              <li><Link to="/requests" className={itemClass("/requests")}>Requests</Link></li>
              <div className="my-1 h-px bg-white/10" />
              <li>
                <button type="button" className="rounded-xl text-error" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
       </div>
     )}
    </div>
  );
};

export default NavBar;