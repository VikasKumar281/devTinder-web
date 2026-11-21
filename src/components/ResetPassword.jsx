import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(BASE_URL + "/auth/reset", { token, password });
      setDone(res.data?.message || "Password updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-align flex justify-center">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-300">Account</p>
        <h1 className="mt-2 text-3xl font-extrabold">Set a new password</h1>
        <p className="mt-2 text-sm text-white/55">
          Use at least 8 characters with uppercase, lowercase, a number, and a symbol.
        </p>
        <input
          type="password"
          value={password}
          placeholder="New password"
          className="input input-bordered mt-6 w-full rounded-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        {done && <p className="mt-3 text-sm text-emerald-300">{done}</p>}
        <button
          type="button"
          className="save-profile mt-5 w-full"
          disabled={loading || !password || Boolean(done)}
          onClick={submit}
        >
          {loading ? "Saving..." : "Update password"}
        </button>
        <Link to="/login" className="mt-4 block text-center text-sm text-rose-300">
          Back to log in
        </Link>
      </section>
    </div>
  );
};

export default ResetPassword;
