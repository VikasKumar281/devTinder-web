import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, GOOGLE_CLIENT_ID } from "../utils/constants";

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.getElementById("google-gsi");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gsi";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });

const GoogleAuthButton = ({ onSuccess, onError, disabled }) => {
  const tokenClientRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [missing, setMissing] = useState(false);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;
    const setup = async () => {
      try {
        const config = await axios.get(BASE_URL + "/auth/google-config");
        const clientId = config.data?.clientId || GOOGLE_CLIENT_ID;
        if (!clientId) {
          if (!cancelled) setMissing(true);
          return;
        }
        await loadGoogleScript();
        if (cancelled || !window.google?.accounts?.oauth2) return;
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid email profile",
          callback: async (response) => {
            if (response.error) {
              onErrorRef.current(response.error_description || "Google login cancelled");
              setBusy(false);
              return;
            }
            try {
              const res = await axios.post(
                BASE_URL + "/auth/google",
                { accessToken: response.access_token },
                { withCredentials: true }
              );
              onSuccessRef.current(res.data);
            } catch (err) {
              onErrorRef.current(err?.response?.data || "Google login failed");
            } finally {
              setBusy(false);
            }
          },
        });
        if (!cancelled) setReady(true);
      } catch (err) {
        if (!cancelled) setMissing(true);
      }
    };
    setup();
    return () => {
      cancelled = true;
    };
  }, []);

  if (missing) {
    return (
      <p className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-center text-xs opacity-60">
        Google login needs GOOGLE_CLIENT_ID on the server.
      </p>
    );
  }

  return (
    <button
      type="button"
      className="google-auth-btn"
      disabled={disabled || !ready || busy}
      onClick={() => {
        setBusy(true);
        tokenClientRef.current?.requestAccessToken({ prompt: "select_account" });
      }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z" />
        <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 1-3.6 1-2.7 0-5-1.8-5.8-4.3H2.9v2.5C4.6 19.7 8 22 12 22z" />
        <path fill="#4A90E2" d="M6.2 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H2.9C2.3 8.9 2 10.4 2 12s.3 3.1.9 4.4l3.3-2.5z" />
        <path fill="#FBBC05" d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 2.9 14.7 2 12 2 8 2 4.6 4.3 2.9 7.6l3.3 2.5C7 7.6 9.3 5.8 12 5.8z" />
      </svg>
      {busy ? "Connecting..." : "Continue with Google"}
    </button>
  );
};

export default GoogleAuthButton;
