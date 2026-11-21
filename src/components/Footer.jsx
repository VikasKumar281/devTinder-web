import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BrandLogo from "./BrandLogo";
import LanguageMenu from "./LanguageMenu";
import { useI18n } from "../utils/i18n";
import { useNavSplash } from "./NavSplash";

const Footer = () => {
  const { t } = useI18n();
  const { trigger } = useNavSplash();
  const user = useSelector((store) => store.user);
  const home = user ? "/feed" : "/login";

  const go = () => trigger();

  return (
    <footer className="site-footer mt-auto">
      <div className="site-footer-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[90rem] px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <Link to={home} className="inline-flex items-center gap-3" onClick={go}>
              <BrandLogo size="md" className="rounded-2xl ring-1 ring-white/15" />
              <span className="text-2xl font-extrabold tracking-tight">DevTinder</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Built for developers who want real collabs — swipe, match, and ship together.
            </p>
          </div>
          <Link
            to={user ? "/premium" : "/login"}
            className="site-footer-cta"
            onClick={go}
          >
            {user ? t("plans") : t("signIn")}
          </Link>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="site-footer-heading">Product</p>
            <ul className="site-footer-list">
              <li>
                <Link to="/feed" onClick={go}>
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/premium" onClick={go}>
                  {t("plans")}
                </Link>
              </li>
              <li>
                <Link to="/connections" onClick={go}>
                  {t("connections")}
                </Link>
              </li>
              <li>
                <Link to="/requests" onClick={go}>
                  {t("requests")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="site-footer-heading">Company</p>
            <ul className="site-footer-list">
              <li>
                <Link to="/support" onClick={go}>
                  {t("support")}
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={go}>
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={go}>
                  {t("profile")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="site-footer-heading">Safety</p>
            <ul className="site-footer-list">
              <li>
                <Link to="/support" onClick={go}>
                  Community rules
                </Link>
              </li>
              <li>
                <Link to="/support" onClick={go}>
                  Report a concern
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={go}>
                  Talk to the team
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="site-footer-heading">Social</p>
            <div className="mt-4 flex gap-2">
              <a
                className="site-footer-social"
                href="https://github.com/VikasKumar281/devTinder"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-1.99 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.12 2.51.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.71 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
                </svg>
              </a>
              <a
                className="site-footer-social"
                href="https://www.linkedin.com/in/vikaskumar-fullstack/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
                </svg>
              </a>
              <Link to="/contact" className="site-footer-social" onClick={go} aria-label="Contact">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </Link>
            </div>
            <p className="mt-4 max-w-[16rem] text-xs leading-relaxed text-white/40">
              Questions about Pulse, Aura, or Orbit? The team replies from Support and Contact.
            </p>
          </div>
        </div>

        <div className="site-footer-bottom">
          <LanguageMenu />
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} DevTinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
