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
  const [requestNotes, setRequestNotes] = useState([]);
  const [chatNotes, setChatNotes] = useState([]);
  const [seen, setSeen] = useState({});
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

  useEffect(() => {
    if (!user) return;
    const loadNotes = async () => {
      try {
        const [requestsRes, chatsRes] = await Promise.all([
          axios.get(BASE_URL + "/user/requests/received", { withCredentials: true }),
          axios.get(BASE_URL + "/chat/notifications", { withCredentials: true }),
        ]);
        setRequestNotes(requestsRes.data.data || []);
        setChatNotes(chatsRes.data.data || []);
      } catch (err) {
        setRequestNotes([]);
        setChatNotes([]);
      }
    };
    loadNotes();
    const timer = setInterval(loadNotes, 20000);
    return () => clearInterval(timer);
  }, [user]);

  const requestKey = (note) => "request-" + note._id;
  const chatKey = (note) => "chat-" + note.userId + "-" + note.text;
  const unreadCount =
    requestNotes.filter((note) => !seen[requestKey(note)]).length +
    chatNotes.filter((note) => !seen[chatKey(note)]).length;

  const markNotificationsRead = () => {
    setSeen((prev) => {
      const next = { ...prev };
      requestNotes.forEach((note) => {
        next[requestKey(note)] = true;
      });
      chatNotes.forEach((note) => {
        next[chatKey(note)] = true;
      });
      return next;
    });
  };

  const closeMenu = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

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
      <div className="flex h-16 w-full items-center justify-between px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3 pl-1">
      <Link to={user ? "/feed" : "/"} className="btn btn-ghost shrink-0 px-2 text-lg font-semibold gap-2">
        <img src="/Logo.png" alt="DevTinder" className="h-8 w-8 rounded-lg object-cover" />
        <span className="hidden sm:inline">DevTinder</span>
      </Link>
      {user ? (
        <div className="relative w-[min(22rem,46vw)]">
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
      </div>
      {user && (
        <div className="flex items-center gap-1">
          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-circle relative"
              aria-label="Notifications"
              onMouseDown={markNotificationsRead}
              onClick={markNotificationsRead}
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <div tabIndex={0} className="dropdown-content z-[40] mt-3 max-h-96 w-80 overflow-y-auto rounded-2xl border border-white/10 bg-base-200 p-3 shadow-2xl">
              <p className="px-1 pb-2 text-sm font-semibold">Notifications</p>
              {requestNotes.length === 0 && chatNotes.length === 0 && (
                <p className="px-1 py-3 text-sm opacity-60">You are all caught up.</p>
              )}
              {requestNotes.length > 0 && (
                <p className="px-2 pb-1 text-[11px] uppercase tracking-wide opacity-50">Requests</p>
              )}
              {requestNotes.map((note) => (
                <button
                  key={note._id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-base-300"
                  onClick={() => {
                    closeMenu();
                    navigate("/requests");
                  }}
                >
                  <img src={note.fromUserId?.photoUrl || "/Logo.png"} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {note.fromUserId?.firstName} sent a request
                    </span>
                    <span className="text-xs opacity-60">Tap to review</span>
                  </span>
                </button>
              ))}
              {chatNotes.length > 0 && (
                <p className="px-2 pb-1 pt-2 text-[11px] uppercase tracking-wide opacity-50">Messages</p>
              )}
              {chatNotes.map((note) => (
                <button
                  key={note.userId}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-base-300"
                  onClick={() => {
                    closeMenu();
                    navigate("/chat/" + note.userId);
                  }}
                >
                  <img src={note.photoUrl || "/Logo.png"} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{note.firstName} {note.lastName}</span>
                    <span className="block truncate text-xs opacity-60">{note.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
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
              <li><Link to="/profile" className={itemClass("/profile")} onClick={closeMenu}>Profile</Link></li>
              <li><Link to="/connections" className={itemClass("/connections")} onClick={closeMenu}>Connections</Link></li>
              <li><Link to="/requests" className={itemClass("/requests")} onClick={closeMenu}>Requests</Link></li>
              <div className="my-1 h-px bg-white/10" />
              <li>
                <button type="button" className="rounded-xl text-error" onClick={() => { closeMenu(); handleLogout(); }}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default NavBar;