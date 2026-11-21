import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useI18n } from "../utils/i18n";
import { BASE_URL } from "../utils/constants";
import PageLoader, { withMinDelay } from "./PageLoader";

const AnswerSkeleton = () => (
  <div className="border-t border-white/10 px-5 py-5">
    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-rose-300">
      <span className="loading loading-spinner loading-xs" />
      Loading answer
    </div>
    <div className="shimmer mb-2 h-3 w-full rounded-full" />
    <div className="shimmer mb-2 h-3 w-11/12 rounded-full" />
    <div className="shimmer mb-2 h-3 w-10/12 rounded-full" />
    <div className="shimmer h-3 w-2/3 rounded-full" />
  </div>
);

const Support = () => {
  const { t } = useI18n();
  const [topics, setTopics] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        await withMinDelay(async () => {
          const res = await axios.get(BASE_URL + "/support/content");
          setTopics(res.data?.data?.topics || []);
          setFaqs(res.data?.data?.faqs || []);
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load support content");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openFaq = async (id) => {
    if (openId === id) {
      setOpenId("");
      setAnswer("");
      setAnswerLoading(false);
      return;
    }
    setOpenId(id);
    setAnswer("");
    setAnswerLoading(true);
    const started = Date.now();
    try {
      const res = await axios.get(BASE_URL + "/support/faq/" + id);
      const wait = Math.max(0, 550 - (Date.now() - started));
      await new Promise((resolve) => setTimeout(resolve, wait));
      setAnswer(res.data?.data?.answer || "");
    } catch (err) {
      setAnswer("Could not load this answer. Try again.");
    } finally {
      setAnswerLoading(false);
    }
  };

  if (loading) return <PageLoader label="Loading support" />;

  return (
    <div className="page-align">
      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-rose-500/20 via-transparent to-indigo-500/10 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">{t("support")}</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">{t("supportTitle")}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-75">{t("supportText")}</p>
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
      <p className="mt-1 text-sm opacity-60">Hover a card for the lift effect.</p>
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
      <p className="mt-1 text-sm opacity-60">Tap a question. The answer loads before it appears.</p>
      <div className="mt-6 grid gap-3">
        {faqs.map((faq) => {
          const open = openId === faq._id;
          return (
            <article
              key={faq._id}
              className={
                "faq-card overflow-hidden rounded-3xl border bg-base-200/80 " +
                (open ? "border-rose-400/40" : "border-white/10")
              }
            >
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left"
                onClick={() => openFaq(faq._id)}
              >
                <span>
                  <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-rose-300">
                    {faq.category}
                  </span>
                  <span className="text-base font-semibold">{faq.question}</span>
                </span>
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-lg opacity-70">
                  {open ? "–" : "+"}
                </span>
              </button>
              {open && answerLoading && <AnswerSkeleton />}
              {open && !answerLoading && answer && (
                <p className="faq-answer border-t border-white/10 px-5 py-5 text-sm leading-7 opacity-85">
                  {answer}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Support;
