import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useI18n } from "../utils/i18n";
import { BASE_URL } from "../utils/constants";
import PageLoader, { withMinDelay } from "./PageLoader";

const fallbackTopics = [
  "General",
  "Account & login",
  "Matching & Feed",
  "Chat",
  "Profile & photo",
  "Safety",
];

const highlights = [
  ["⚡", "Fast reply", "We read new tickets daily and reply to the email you share."],
  ["🔒", "Private", "Your message never appears on Feed, Chat, or public profiles."],
  ["♥", "Real people", "A human on the DevTinder team reads every report and bug."],
  ["▣", "Tracked", "Each ticket is stored in MongoDB with name, topic, and time."],
  ["✦", "Safety first", "Harassment, spam, and fake profiles get priority review."],
  ["◎", "Product help", "Login issues, photos, likes, and chat problems are all covered."],
];

const steps = [
  ["01", "Pick a topic", "Account, matching, chat, photo, or safety — so we route it right."],
  ["02", "Tell the story", "Include names, error text, and what you already tried."],
  ["03", "We email you", "A copy goes to vikaskumar280204@gmail.com and a note can reach your inbox."],
];

const faqs = [
  ["How fast do you reply?", "Most messages are read within a day. Safety reports are checked first."],
  ["Will other users see this?", "No. Contact tickets are only for the DevTinder team."],
  ["Can I attach a screenshot?", "Paste error text for now, or describe the screen. Photo uploads stay on Profile."],
  ["What if I did not get email?", "Check spam. The first mail may ask you to confirm FormSubmit, then messages arrive."],
];

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await withMinDelay(async () => {
          const res = await axios.get(BASE_URL + "/support/content");
          const names = (res.data?.data?.topics || []).map((item) => item.title);
          if (names.length) setTopics(["General", ...names]);
        });
      } catch (err) {
        setTopics(fallbackTopics);
      } finally {
        setLoading(false);
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

  if (loading) return <PageLoader label="Loading contact" />;

  return (
    <div className="page-align">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-rose-500/25 via-[#1a1020] to-indigo-500/20 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300">{t("contact")}</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">{t("contactTitle")}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">{t("contactText")}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
          Every message is saved and emailed to{" "}
          <a className="font-semibold text-rose-300" href="mailto:vikaskumar280204@gmail.com">
            vikaskumar280204@gmail.com
          </a>
          . Do not include passwords or OTPs.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="mailto:vikaskumar280204@gmail.com"
            className="btn rounded-full border-none bg-rose-500 px-6 text-white shadow-lg shadow-rose-500/30"
          >
            Email us directly
          </a>
          <Link to="/support" className="btn btn-ghost rounded-full border border-white/15">
            Browse support
          </Link>
        </div>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map(([icon, title, text]) => (
          <article key={title} className="support-card rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-lg">
              {icon}
            </div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">{text}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <p className="mt-1 text-sm opacity-60">Three steps. No account required to send a ticket.</p>
          <div className="mt-5 space-y-3">
            {steps.map(([num, title, text]) => (
              <article key={num} className="support-card flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
                <span className="text-sm font-extrabold text-rose-400">{num}</span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed opacity-70">{text}</p>
                </div>
              </article>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">Quick answers</h2>
          <div className="mt-4 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="faq-card rounded-3xl border border-white/10 bg-base-200/70 p-5">
                <summary className="cursor-pointer list-none font-semibold">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed opacity-70">{a}</p>
              </details>
            ))}
          </div>
        </div>

        <div>
          {sent ? (
            <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-8">
              <p className="text-2xl font-bold text-emerald-200">Thanks, {name.trim()}.</p>
              <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">{t("sent")}</p>
              <p className="mt-2 text-sm opacity-70">
                {emailSent
                  ? "Check inbox and spam. The first email may ask you to confirm, then the message arrives."
                  : "Your ticket is stored for the team even if email is delayed."}
              </p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="grid gap-4 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl sm:p-8"
            >
              <p className="text-lg font-semibold">Send a message</p>
              <p className="text-sm opacity-60">We reply to the email you enter below.</p>
              <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
                {t("name")}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered h-12 rounded-full bg-black/25"
                  required
                  minLength={2}
                  placeholder="Your name"
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
                  placeholder="you@email.com"
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
                  placeholder="What happened? Include names, the page, and any error text."
                />
              </label>
              {error && (
                <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              )}
              <button
                className="btn mt-1 h-12 rounded-full border-none bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                disabled={saving}
              >
                {saving ? t("wait") : t("send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
