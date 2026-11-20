import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      return navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!!");
    }
  };

  const handleSignUp = async () => {
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!!");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-4 py-10">
      <div className="grid w-full overflow-hidden rounded-2xl bg-base-200 shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-base-300 p-10 md:flex">
          <img src="/Logo.png" alt="DevTinder" className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <h1 className="text-3xl font-bold">DevTinder</h1>
            <p className="mt-3 text-sm opacity-70">
              Meet developers, send a request, and start a chat when you both match.
            </p>
          </div>
        </div>

        <div className="card-body gap-3 p-8">
          <h2 className="text-2xl font-semibold">
            {isLoginForm ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm opacity-70">
            {isLoginForm
              ? "Log in to see your feed."
              : "First name needs at least 4 characters. Use a strong password."}
          </p>

          {!isLoginForm && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="form-control">
                <span className="label-text mb-1">First name</span>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1">Last name</span>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
          )}

          <label className="form-control">
            <span className="label-text mb-1">Email</span>
            <input
              type="email"
              value={emailId}
              className="input input-bordered w-full"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">Password</span>
            <input
              type="password"
              value={password}
              className="input input-bordered w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            className="btn btn-primary mt-2"
            onClick={isLoginForm ? handleLogin : handleSignUp}
          >
            {isLoginForm ? "Login" : "Sign up"}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setError("");
              setIsLoginForm((value) => !value);
            }}
          >
            {isLoginForm ? "New here? Create an account" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
