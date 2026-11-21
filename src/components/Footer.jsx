import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useI18n } from "../utils/i18n";

const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="mt-auto flex w-full flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-4 py-4 text-sm sm:px-6">
      <div className="flex items-center gap-2">
        <BrandLogo size="sm" className="rounded-md" />
        <span className="font-semibold">DevTinder</span>
      </div>
      <div className="flex items-center gap-4 text-sm font-semibold">
        <Link to="/support" className="opacity-70 hover:opacity-100">
          {t("support")}
        </Link>
        <Link to="/contact" className="opacity-70 hover:opacity-100">
          {t("contact")}
        </Link>
      </div>
      <p className="opacity-60">© {new Date().getFullYear()} All rights reserved</p>
    </footer>
  );
};

export default Footer;
