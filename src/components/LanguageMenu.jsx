import { useMemo, useState } from "react";
import { LANGUAGES } from "../utils/languages";
import { useI18n } from "../utils/i18n";

const LanguageMenu = () => {
  const { lang, setLang, t, current } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (item) =>
        item.native.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        tabIndex={0}
        className="nav-link inline-flex items-center gap-2"
        aria-label={t("language")}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
        </svg>
        <span className="hidden max-w-[8rem] truncate lg:inline">{current?.native || "English"}</span>
      </button>
      <div
        tabIndex={0}
        className="dropdown-content z-[50] mt-3 w-[min(34rem,92vw)] rounded-3xl border border-white/10 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">{t("language")}</p>
          <p className="text-xs opacity-50">{LANGUAGES.length}</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search language"
          className="input input-sm mb-3 h-10 w-full rounded-full border-white/10 bg-white/5"
        />
        <div className="grid max-h-80 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <button
              key={item.code}
              type="button"
              className={
                "rounded-2xl px-3 py-2.5 text-left transition hover:bg-white/10 " +
                (lang === item.code ? "bg-rose-500 text-white" : "")
              }
              onClick={() => {
                setLang(item.code);
                setQuery("");
                if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
              }}
            >
              <span className="block text-sm font-medium">{item.native}</span>
              <span className={"block text-[11px] " + (lang === item.code ? "text-white/80" : "opacity-50")}>
                {item.english}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full px-2 py-6 text-center text-sm opacity-60">No languages found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageMenu;
