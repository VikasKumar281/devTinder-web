import { useEffect, useState } from "react";
import axios from "axios";
import { useI18n } from "../utils/i18n";
import { BASE_URL } from "../utils/constants";

const fallbackTopics = ["General", "Account & login", "Matching & Feed", "Chat", "Profile & photo", "Safety"];

const Contact = () => {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General");
  const [message, setMessage] = useState("");
  const [topics, setTopics] = useState(fallbackTopics);
  const [sent, setSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(BASE_URL + "/support/content");
        const names = (res.data?.data?.topics || []).map((item) => item.title);
        if (names.length) setTopics(["General", ...names]);
      } catch (err) {
        setTopics(fallbackTopics);
      }
    };
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await axios.post(BASE_URL + "/support/contact", {
        name: name.trim(),
        email: email.trim(),
        topic,
        message: message.trim(),
      });
      setEmailSent(Boolean(res.data?.data?.emailSent));
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your message");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">{t("contact")}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{t("contactTitle")}</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed opacity-75">{t("contactText")}</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-60">
          Every message is saved in MongoDB and emailed to
          {" "}
          <a className="font-semibold text-rose-300" href="mailto:vikaskumar280204@gmail.com">
            vikaskumar280204@gmail.com
          </a>
          . Do not include passwords.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["Response", "We read new tickets from the database regularly."],
            ["Privacy", "Your contact details stay on the server, not in the public feed."],
            ["Topics", "Pick a topic so we can route the right person."],
            ["Support first", "Many answers are already on the Support page."],
          ].map(([title, text]) => (
            <article key={title} className="support-card rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        {sent ? (
          <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-8">
            <p className="text-2xl font-bold text-emerald-200">Thanks, {name.trim()}.</p>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">{t("sent")}</p>
            <p className="mt-2 text-sm opacity-70">
              {emailSent
                ? "Check your inbox (and spam). The first email may ask you to confirm the sender, then the message arrives."
                : "Your ticket is stored. Email could not be delivered yet — check spam or try again."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl sm:p-8"
          >
            <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
              {t("name")}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered h-12 rounded-full bg-black/25"
                required
                minLength={2}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
              {t("email")}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered h-12 rounded-full bg-black/25"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
              Topic
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="select select-bordered h-12 rounded-full bg-black/25"
              >
                {topics.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
              {t("message")}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="textarea textarea-bordered min-h-36 rounded-3xl bg-black/25"
                required
                minLength={10}
                placeholder="Tell us what happened, including names or error text."
              />
            </label>
            {error && (
              <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            )}
            <button
              className="btn mt-1 h-12 rounded-full border-none bg-rose-500 text-white shadow-lg shadow-rose-500/30"
              disabled={saving}
            >
              {saving ? t("wait") : t("send")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Contact;
