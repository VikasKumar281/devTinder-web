import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if (firstName.trim().length < 4) {
      setError("First name must be at least 4 characters");
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

  return (
    <div className="flex min-h-[78vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-base-200 p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <img src="/Logo.png" alt="" className="h-12 w-12 rounded-2xl object-cover" />
          <div>
            <p className="text-lg font-bold">DevTinder</p>
            <p className="text-xs opacity-60">Find developers you want to work with</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-full bg-base-300 p-1">
          <button
            type="button"
            className={`rounded-full py-2 text-sm font-medium ${isLoginForm ? "bg-primary text-primary-content" : "opacity-70"}`}
            onClick={() => switchMode(true)}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`rounded-full py-2 text-sm font-medium ${!isLoginForm ? "bg-primary text-primary-content" : "opacity-70"}`}
            onClick={() => switchMode(false)}
          >
            Sign up
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {!isLoginForm && (
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm">
                First name
                <input
                  type="text"
                  value={firstName}
                  placeholder="Aarav"
                  className="input input-bordered w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Last name
                <input
                  type="text"
                  value={lastName}
                  placeholder="Mehta"
                  className="input input-bordered w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
          )}

          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              value={emailId}
              placeholder="you@email.com"
              className="input input-bordered w-full"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Password
            <input
              type="password"
              value={password}
              placeholder={isLoginForm ? "Your password" : "Dev@1234"}
              className="input input-bordered w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {!isLoginForm && (
            <ul className="grid grid-cols-1 gap-1 text-xs">
              {checks.map((check) => (
                <li key={check.label} className={check.ok ? "text-success" : "opacity-60"}>
                  {check.ok ? "✓" : "○"} {check.label}
                </li>
              ))}
            </ul>
          )}

          {error && (
            <p className="rounded-xl bg-error/15 px-3 py-2 text-sm text-error">{error}</p>
          )}

          <button
            className="btn btn-primary mt-1"
            disabled={loading}
            onClick={isLoginForm ? handleLogin : handleSignUp}
          >
            {loading ? "Please wait..." : isLoginForm ? "Sign in" : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
