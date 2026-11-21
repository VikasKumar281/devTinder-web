import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, GOOGLE_CLIENT_ID } from "../utils/constants";

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
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
  const boxRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [ready, setReady] = useState(false);
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
        if (cancelled || !boxRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const res = await axios.post(
                BASE_URL + "/auth/google",
                { credential: response.credential },
                { withCredentials: true }
              );
              onSuccessRef.current(res.data);
            } catch (err) {
              onErrorRef.current(err?.response?.data || "Google login failed");
            }
          },
        });
        boxRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(boxRef.current, {
          theme: "filled_black",
          size: "large",
          width: 336,
          text: "continue_with",
          shape: "pill",
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
    <div className={"flex justify-center " + (disabled ? "pointer-events-none opacity-50" : "")}>
      <div ref={boxRef} className={ready ? "min-h-10" : "shimmer h-10 w-full max-w-xs rounded-full"} />
    </div>
  );
};

export default GoogleAuthButton;
