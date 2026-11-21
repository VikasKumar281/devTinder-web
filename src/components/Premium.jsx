import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import PageLoader, { withMinDelay } from "./PageLoader";
import { useI18n } from "../utils/i18n";

const fallbackPlans = [
  {
    id: "pulse",
    name: "Pulse",
    tagline: "Swipe without the countdown.",
    displayPrice: "₹499",
    period: "month",
    features: [
      "Unlimited likes on the feed",
      "Undo your last pass",
      "Browse other cities before you travel",
      "Quieter feed with fewer interruptions",
      "Show up only to people you already liked",
    ],
  },
  {
    id: "aura",
    name: "Aura",
    tagline: "Know who already wants to build with you.",
    displayPrice: "₹999",
    period: "month",
    popular: true,
    features: [
      "Everything in Pulse",
      "See who sent you a like first",
      "Three Super Pings every week",
      "One profile Boost each month",
    ],
  },
  {
    id: "orbit",
    name: "Orbit",
    tagline: "Land at the top of their stack.",
    displayPrice: "₹1,499",
    period: "month",
    features: [
      "Everything in Aura",
      "Your likes jump the queue",
      "Send a note before they match",
      "Priority placement in nearby feeds",
    ],
  },
];

const stories = [
  {
    title: "Like without counting",
    text: "Pulse removes the daily like cap so you can keep exploring developers who actually ship.",
  },
  {
    title: "See who already said yes",
    text: "Aura shows incoming likes first. Skip the guessing and start conversations that are already mutual.",
  },
  {
    title: "Show up where it counts",
    text: "Orbit puts your profile higher in the stack for people you care about, without shouting.",
  },
];

const Premium = () => {
  const { t } = useI18n();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState(fallbackPlans);
  const [stripeReady, setStripeReady] = useState(false);
  const [buying, setBuying] = useState("");
  const [error, setError] = useState("");
  const [statusPlan, setStatusPlan] = useState(user?.membershipType || "free");
  const current = statusPlan || user?.membershipType || "free";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await withMinDelay(async () => {
          const res = await axios.get(BASE_URL + "/premium/plans");
          const list = res.data?.data?.plans;
          setPlans(Array.isArray(list) && list.length ? list : fallbackPlans);
          setStripeReady(Boolean(res.data?.data?.stripeReady));
          if (user) {
            try {
              const [status, profile] = await Promise.all([
                axios.get(BASE_URL + "/premium/status", { withCredentials: true }),
                axios.get(BASE_URL + "/profile/view", { withCredentials: true }),
              ]);
              setStatusPlan(status.data?.data?.membershipType || "free");
              dispatch(addUser(profile.data));
            } catch {
              setStatusPlan(user.membershipType || "free");
            }
          }
        });
      } catch (err) {
        setPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id, dispatch]);

  const buy = async (planId) => {
    setError("");
    if (!user) {
      navigate("/login");
      return;
    }
    setBuying(planId);
    try {
      const res = await axios.post(
        BASE_URL + "/premium/checkout",
        { plan: planId },
        { withCredentials: true }
      );
      const url = res.data?.data?.url;
      if (!url) throw new Error("Checkout link missing");
      window.location.href = url;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || err.message || "Could not start checkout");
      setBuying("");
    }
  };

  if (loading) return <PageLoader label="Loading plans" />;

  return (
    <div className="page-align">
      <section className="hover-lift relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-amber-400/20 via-[#1a1020] to-rose-500/20 px-6 py-12 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">{t("plans")}</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          More control over how you connect.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
          Pick a DevTinder plan that matches how you ship. Free is enough to start. Pulse, Aura, and Orbit add reach, rewind, and clarity — without copying anyone else’s playbook.
        </p>
        {current !== "free" && (
          <p className="mt-4 inline-flex rounded-full bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-200">
            You are on {current}
          </p>
        )}
      </section>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={
              "support-card flex flex-col rounded-[1.8rem] border p-6 " +
              (plan.popular ? "border-amber-300/50 bg-amber-400/10" : "border-white/10 bg-white/5")
            }
          >
            {plan.popular && (
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">Most chosen</p>
            )}
            <h2 className="text-3xl font-extrabold">{plan.name}</h2>
            <p className="mt-2 text-sm opacity-70">{plan.tagline}</p>
            <p className="mt-5 text-4xl font-extrabold">
              {plan.displayPrice}
              <span className="ml-1 text-sm font-medium opacity-50">/{plan.period}</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2 text-sm opacity-85">
              {(plan.features || []).map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
            <button
              type="button"
              className="btn mt-6 h-12 rounded-full border-none bg-gradient-to-r from-rose-500 to-amber-400 text-white"
              disabled={Boolean(buying) || current === plan.id}
              onClick={() => buy(plan.id)}
            >
              {current === plan.id ? "Current plan" : buying === plan.id ? t("wait") : "Get " + plan.name}
            </button>
          </article>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}
      {!stripeReady && (
        <p className="mt-4 text-center text-sm opacity-50">
          Checkout unlocks after Stripe keys are added on the server.
        </p>
      )}

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.title} className="support-card rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">{story.title}</h3>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{story.text}</p>
          </article>
        ))}
      </div>

      <p className="mt-10 text-center text-sm opacity-50">
        Cancel anytime from Stripe. Questions?{" "}
        <Link to="/contact" className="text-rose-300">
          {t("contact")}
        </Link>
      </p>
    </div>
  );
};

export default Premium;
