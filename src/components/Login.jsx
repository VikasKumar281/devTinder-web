import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import BrandLogo from "./BrandLogo";
import { useI18n } from "../utils/i18n";

const passwordChecks = (password) => [
  { label: "8 or more characters", ok: password.length >= 8 },
  { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
  { label: "One lowercase letter", ok: /[a-z]/.test(password) },
  { label: "One number", ok: /[0-9]/.test(password) },
  { label: "One symbol", ok: /[^A-Za-z0-9]/.test(password) },
];

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useI18n();
  const checks = passwordChecks(password);

  const switchMode = (loginMode) => {
    setIsLoginForm(loginMode);
    setError("");
  };

  const handleLogin = async () => {
    setError("");
    if (!emailId.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        { emailId: emailId.trim(), password },
        { withCredentials: true }
      );
      dispatch(clearFeed());
      dispatch(addUser(response.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    if (firstName.trim().length < 2) {
      setError("First name must be at least 2 characters");
      return;
    }
    if (!emailId.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    if (checks.some((check) => !check.ok)) {
      setError("Password does not meet the rules below");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailId: emailId.trim(),
          password,
        },
        { withCredentials: true }
      );
      dispatch(clearFeed());
      dispatch(addUser(res.data.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const submit = () => (isLoginForm ? handleLogin() : handleSignUp());

  return (
    <div className="relative mx-auto grid min-h-[calc(100vh-8.5rem)] w-full max-w-6xl overflow-hidden px-4 py-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8">
      <section className="relative hidden overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-rose-500/20 via-indigo-500/10 to-transparent p-10 lg:flex lg:min-h-[36rem] lg:flex-col lg:justify-between">
        <span className="auth-orb h-40 w-40 bg-rose-500/40" style={{ top: "12%", left: "8%" }} />
        <span className="auth-orb h-28 w-28 bg-indigo-500/40" style={{ right: "12%", top: "28%", animationDelay: "1.2s" }} />
        <span className="auth-orb h-24 w-24 bg-sky-400/30" style={{ bottom: "16%", left: "28%", animationDelay: "2s" }} />
        <div>
          <div className="mb-5 flex items-center gap-3">
            <BrandLogo size="lg" className="ring-2 ring-white/20" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-200/80">DevTinder</p>
          </div>
          <h1 className="mt-4 max-w-sm text-5xl font-extrabold leading-[1.05] tracking-tight">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            {t("heroText")}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["12k+", "developers"],
            ["8k+", "matches"],
            ["24/7", "chat"],
          ].map(([stat, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-xl font-bold">{stat}</p>
              <p className="text-xs capitalize opacity-60">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-md">
        <div className="glass-card rounded-[2rem] border border-white/10 p-7 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <BrandLogo size="lg" className="ring-2 ring-rose-400/40" />
            <div>
              <p className="text-lg font-bold">{t("welcome")}</p>
              <p className="text-xs opacity-60">
                {isLoginForm ? t("signInHint") : t("signUpHint")}
              </p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-full bg-black/25 p-1">
            <button
              type="button"
              className={`rounded-full py-2.5 text-sm font-semibold ${isLoginForm ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "opacity-70"}`}
              onClick={() => switchMode(true)}
            >
              {t("signIn")}
            </button>
            <button
              type="button"
              className={`rounded-full py-2.5 text-sm font-semibold ${!isLoginForm ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "opacity-70"}`}
              onClick={() => switchMode(false)}
            >
              {t("signUp")}
            </button>
          </div>

          <div
            className="flex flex-col gap-4"
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
          >
            {!isLoginForm && (
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
                  {t("firstName")}
                  <input
                    type="text"
                    value={firstName}
                    placeholder="Aarav"
                    className="input input-bordered auth-input w-full"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
                  {t("lastName")}
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Mehta"
                    className="input input-bordered auth-input w-full"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
            )}

            <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
              {t("email")}
              <input
                type="email"
                value={emailId}
                placeholder="you@email.com"
                className="input input-bordered auth-input w-full"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
              {t("password")}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder={isLoginForm ? "Your password" : "Dev@1234"}
                  className="input input-bordered auth-input w-full pr-16"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold opacity-70"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? t("hide") : t("show")}
                </button>
              </div>
            </label>

            {!isLoginForm && (
              <ul className="grid grid-cols-1 gap-1.5 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs">
                {checks.map((check) => (
                  <li key={check.label} className={check.ok ? "text-emerald-400" : "opacity-55"}>
                    {check.ok ? "✓" : "○"} {check.label}
                  </li>
                ))}
              </ul>
            )}

            {error && (
              <p className="rounded-2xl border border-rose-400/20 bg-rose-500/15 px-3 py-2 text-sm text-rose-200">
                {typeof error === "string" ? error : "Something went wrong"}
              </p>
            )}

            <button
              className="btn mt-1 h-12 rounded-full border-none bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
              disabled={loading}
              onClick={submit}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  {t("wait")}
                </span>
              ) : isLoginForm ? (
                t("signIn")
              ) : (
                t("createAccount")
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
