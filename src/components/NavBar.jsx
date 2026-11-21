import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";
import BrandLogo from "./BrandLogo";
import LanguageMenu from "./LanguageMenu";
import { useI18n } from "../utils/i18n";
import { useNavSplash } from "./NavSplash";

const LINKEDIN_URL = "https://www.linkedin.com/in/vikaskumar-fullstack/";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
  </svg>
);

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const { trigger } = useNavSplash();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notes, setNotes] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
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
        const res = await axios.get(BASE_URL + "/notifications", {
          withCredentials: true,
        });
        setNotes(res.data.data || []);
        setUnreadCount(res.data.unread || 0);
      } catch (err) {
        setNotes([]);
        setUnreadCount(0);
      }
    };
    loadNotes();
    const timer = setInterval(loadNotes, 12000);
    return () => clearInterval(timer);
  }, [user]);

  const markNotificationsRead = async () => {
    setUnreadCount(0);
    try {
      await axios.post(BASE_URL + "/notifications/read", {}, { withCredentials: true });
      setNotes((prev) => prev.map((note) => ({ ...note, read: true })));
    } catch (err) {
      /* keep list visible even if mark-read fails */
    }
  };

  const closeMenu = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const openProfile = (userId) => {
    setSearchText("");
    setSearchResults([]);
    trigger();
    navigate("/user/" + userId);
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
        dispatch(clearFeed());
      trigger();
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const linkClass = (path) =>
    "nav-link " + (location.pathname === path ? "nav-link-active" : "");

  const premium = Boolean(user?.isPremium && user?.membershipType && user.membershipType !== "free");

  return (
    <header className="site-nav">
      <div className="site-nav-bar">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            to={user ? "/feed" : "/"}
            className="site-nav-brand"
            onClick={trigger}
          >
            <BrandLogo size="md" className="rounded-[0.9rem] ring-1 ring-white/15" />
            <span className="hidden sm:inline">DevTinder</span>
          </Link>
          {user && (
            <div className="relative hidden w-[min(16rem,32vw)] md:block">
              <label className="search-shell">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3-3" />
                </svg>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={t("search")}
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:opacity-50"
                />
              </label>
              {searchText.trim() && (
                <div className="absolute left-0 right-0 top-12 z-30 max-h-80 overflow-auto rounded-2xl border border-white/10 bg-neutral-950 p-2 shadow-2xl">
                  {searchResults.length === 0 ? (
                    <p className="px-3 py-2 text-sm opacity-60">{t("noUsers")}</p>
                  ) : (
                    searchResults.map((person) => (
                      <button
                        key={person._id}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/10"
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
                            <span className="block truncate text-xs opacity-60">
                              {person.skills.slice(0, 2).join(" · ")}
                            </span>
                          )}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="flex shrink-0 items-center gap-1.5">
          <div className="nav-cluster">
            {user && (
              <Link to="/feed" className={linkClass("/feed")} onClick={trigger}>
                Feed
              </Link>
            )}
            <Link to="/support" className={linkClass("/support")} onClick={trigger}>
              {t("support")}
            </Link>
            <Link to="/contact" className={linkClass("/contact")} onClick={trigger}>
              {t("contact")}
            </Link>
            <Link
              to="/premium"
              className={
                "nav-link nav-premium " +
                (location.pathname.startsWith("/premium") ? "nav-link-active" : "")
              }
              onClick={trigger}
            >
              {t("plans")}
            </Link>
          </div>

          <LanguageMenu />
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="nav-icon-btn hidden sm:inline-flex"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>

          {!user && (
            <Link to="/login" className="nav-login" onClick={trigger}>
              {t("signIn")}
            </Link>
          )}

          {user && (
            <>
              <div className="relative">
                <button
                  type="button"
                  className="nav-icon-btn relative"
                  aria-label={t("notifications")}
                  onClick={() => {
                    setNotesOpen((open) => !open);
                    markNotificationsRead();
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 9a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
                    <path d="M10 20a2 2 0 0 0 4 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notesOpen && (
                  <div className="absolute right-0 z-[60] mt-3 w-[min(22rem,86vw)] overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-3 shadow-2xl">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <p className="text-sm font-semibold">{t("notifications")}</p>
                      <button type="button" className="text-xs opacity-50" onClick={() => setNotesOpen(false)}>
                        Close
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notes.length === 0 && (
                        <p className="px-1 py-6 text-center text-sm opacity-60">{t("caughtUp")}</p>
                      )}
                      {notes.map((note) => (
                        <button
                          key={note._id}
                          type="button"
                          className={
                            "mb-1 flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/10 " +
                            (note.read ? "opacity-70" : "")
                          }
                          onClick={() => {
                            setNotesOpen(false);
                            trigger();
                            navigate(note.link || "/feed");
                          }}
                        >
                          <img
                            src={note.photoUrl || note.fromUserId?.photoUrl || "/Logo.png"}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{note.title}</span>
                            {note.body && (
                              <span className="mt-0.5 block truncate text-xs opacity-60">{note.body}</span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className={"nav-avatar " + (premium ? "nav-avatar-premium" : "")}
                >
                  <img alt="user photo" src={user?.photoUrl || "/Logo.png"} />
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-[20] mt-3 w-60 rounded-2xl border border-white/10 bg-neutral-950 p-2 shadow-2xl"
                >
                  <li className="pointer-events-none px-3 py-2">
                    <p className="text-sm font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs opacity-60">{user.emailId}</p>
                    {user.isPremium && user.membershipType && user.membershipType !== "free" && (
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                        {user.membershipType} plan
                      </p>
                    )}
                  </li>
                  <div className="my-1 h-px bg-white/10" />
                  <li>
                    <Link to="/profile" className={itemClass("/profile")} onClick={() => { trigger(); closeMenu(); }}>
                      {t("profile")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/connections" className={itemClass("/connections")} onClick={() => { trigger(); closeMenu(); }}>
                      {t("connections")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/requests" className={itemClass("/requests")} onClick={() => { trigger(); closeMenu(); }}>
                      {t("requests")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/premium" onClick={() => { trigger(); closeMenu(); }}>
                      {t("plans")}
                    </Link>
                  </li>
                  <li className="sm:hidden">
                    <Link to="/support" onClick={() => { trigger(); closeMenu(); }}>
                      {t("support")}
                    </Link>
                  </li>
                  <li className="sm:hidden">
                    <Link to="/contact" onClick={() => { trigger(); closeMenu(); }}>
                      {t("contact")}
                    </Link>
                  </li>
                  <li>
                    <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>
                      LinkedIn
                    </a>
                  </li>
                  <div className="my-1 h-px bg-white/10" />
                  <li>
                    <button
                      type="button"
                      className="rounded-xl text-error"
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                    >
                      {t("logout")}
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
