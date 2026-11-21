import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useI18n } from "../utils/i18n";
import { BASE_URL } from "../utils/constants";
import PageLoader from "./PageLoader";

const Support = () => {
  const { t } = useI18n();
  const [topics, setTopics] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(BASE_URL + "/support/content");
        setTopics(res.data?.data?.topics || []);
        setFaqs(res.data?.data?.faqs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load support content");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageLoader label="Loading support" />;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-rose-500/20 via-transparent to-indigo-500/10 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">{t("support")}</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">{t("supportTitle")}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-75">{t("supportText")}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-60">
          Browse topics, open a question for a full answer, or send a message. Everything you submit on Contact us is stored in our database so the team can reply.
        </p>
        <Link
          to="/contact"
          className="btn mt-6 rounded-full border-none bg-rose-500 px-8 text-white shadow-lg shadow-rose-500/30"
        >
          {t("contact")}
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Help topics</h2>
      <p className="mt-1 text-sm opacity-60">Hover a card to highlight it. Each topic is loaded from MongoDB.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <article key={topic._id} className="support-card rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-xl">
              {topic.icon}
            </div>
            <h3 className="text-lg font-semibold">{topic.title}</h3>
            <p className="mt-2 text-sm opacity-70">{topic.summary}</p>
            <p className="mt-3 text-sm leading-relaxed opacity-80">{topic.details}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-bold tracking-tight">Questions & answers</h2>
      <p className="mt-1 text-sm opacity-60">Tap a question to expand the full guide.</p>
      <div className="mt-6 grid gap-3">
        {faqs.map((faq) => {
          const open = openId === faq._id;
          return (
            <article
              key={faq._id}
              className="faq-card overflow-hidden rounded-3xl border border-white/10 bg-base-200/80"
            >
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left"
                onClick={() => setOpenId(open ? "" : faq._id)}
              >
                <span>
                  <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-rose-300">
                    {faq.category}
                  </span>
                  <span className="text-base font-semibold">{faq.question}</span>
                </span>
                <span className="mt-1 text-xl opacity-50">{open ? "–" : "+"}</span>
              </button>
              {open && (
                <p className="border-t border-white/10 px-5 py-5 text-sm leading-7 opacity-80">{faq.answer}</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Support;
