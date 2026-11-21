import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import PageLoader, { withMinDelay } from "./PageLoader";
import { addUser } from "../utils/userSlice";

const copy = {
  pulse: {
    name: "Pulse",
    line: "Unlimited likes, undo, and a quieter feed are on.",
  },
  aura: {
    name: "Aura",
    line: "You can see who liked you first, plus Super Pings and a monthly Boost.",
  },
  orbit: {
    name: "Orbit",
    line: "Your likes jump the queue, and you can send a note before a match.",
  },
};

const PremiumSuccess = () => {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await withMinDelay(async () => {
          if (!sessionId) {
            setError("Missing checkout session. Open Plans and try again.");
            return;
          }
          const res = await axios.get(BASE_URL + "/premium/session/" + sessionId, {
            withCredentials: true,
          });
          setPlan(res.data?.data?.plan || "");
          const profile = await axios.get(BASE_URL + "/profile/view", {
            withCredentials: true,
          });
          dispatch(addUser(profile.data));
        });
      } catch (err) {
        setError(err.response?.data?.message || "Payment is processing. Refresh in a moment.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId, dispatch]);

  if (loading) return <PageLoader label="Confirming payment" />;

  const details = copy[plan] || null;

  return (
    <div className="page-align">
      <section className="hover-lift relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-amber-400/25 via-[#161018] to-rose-500/25 px-6 py-14 text-center sm:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-amber-200">Payment confirmed</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">You’re in.</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
          {error ||
            (details
              ? `${details.name} is active on this account. ${details.line}`
              : "Thanks. Your membership will show on your profile in a few seconds.")}
        </p>
        {details && !error && (
          <p className="mt-6 inline-flex rounded-full border border-amber-300/30 bg-amber-400/15 px-5 py-2 text-sm font-semibold text-amber-100">
            {details.name} membership
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/feed" className="site-footer-cta">
            Open feed
          </Link>
          <Link
            to="/profile"
            className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm font-semibold"
          >
            View profile
          </Link>
          <Link
            to="/premium"
            className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm font-semibold"
          >
            View plans
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Saved", text: "Your plan is stored on your account and shows on Profile." },
          { title: "Feed", text: "Go back to swiping with the extras that come with this plan." },
          { title: "Cancel", text: "You can cancel anytime from the Stripe receipt in your email." },
        ].map((item) => (
          <article key={item.title} className="hover-lift rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PremiumSuccess;
