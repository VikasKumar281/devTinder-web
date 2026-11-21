import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import EditProfile from "./EditProfile";
import PageLoader, { withMinDelay } from "./PageLoader";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      setLoading(true);
      try {
        await withMinDelay(async () => {
          const [profileRes, statusRes] = await Promise.all([
            axios.get(BASE_URL + "/profile/view", { withCredentials: true }),
            axios.get(BASE_URL + "/premium/status", { withCredentials: true }).catch(() => null),
          ]);
          if (!live) return;
          dispatch(addUser(profileRes.data));
          setStatus(statusRes?.data?.data || null);
        });
      } finally {
        if (live) setLoading(false);
      }
    };
    load();
    return () => {
      live = false;
    };
  }, [dispatch]);

  if (loading || !user) return <PageLoader label="Loading profile" />;

  const planName = status?.plan?.name || (user.membershipType && user.membershipType !== "free" ? user.membershipType : null);
  const expires = status?.membershipExpiresAt || user.membershipExpiresAt;

  return (
    <div className="page-align">
      <section className="hover-lift relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-rose-500/20 via-[#151018] to-amber-400/10 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            src={user.photoUrl || "/Logo.png"}
            alt=""
            className="h-24 w-24 rounded-[1.4rem] object-cover ring-2 ring-white/20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">Profile</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 truncate text-sm text-white/55">{user.emailId}</p>
            {planName ? (
              <p className="mt-3 inline-flex rounded-full bg-amber-400/15 px-4 py-1.5 text-sm font-semibold capitalize text-amber-200">
                {planName} · active
                {expires ? " · until " + new Date(expires).toLocaleDateString() : ""}
              </p>
            ) : (
              <p className="mt-3 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70">
                Free plan
              </p>
            )}
          </div>
          <Link to="/premium" className="site-footer-cta">
            {planName ? "Manage plan" : "See plans"}
          </Link>
        </div>
      </section>
      <EditProfile user={user} membership={status} />
    </div>
  );
};

export default Profile;
