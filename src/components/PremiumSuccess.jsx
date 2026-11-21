import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import PageLoader, { withMinDelay } from "./PageLoader";
import { addUser } from "../utils/userSlice";

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

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">DevTinder</p>
      <h1 className="mt-3 text-4xl font-extrabold">You’re in.</h1>
      <p className="mt-3 text-sm leading-relaxed opacity-70">
        {error ||
          (plan
            ? `Your ${plan} plan is active. Enjoy the extra reach on Feed.`
            : "Thanks. Your membership will show on your profile in a few seconds.")}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/feed" className="btn rounded-full border-none bg-rose-500 text-white">
          Open feed
        </Link>
        <Link to="/premium" className="btn btn-ghost rounded-full border border-white/15">
          View plans
        </Link>
      </div>
    </div>
  );
};

export default PremiumSuccess;
