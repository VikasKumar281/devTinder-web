import BrandLogo from "./BrandLogo";

const SplashScreen = ({ fading }) => (
  <div className={"tinder-splash " + (fading ? "tinder-splash-out" : "")} role="status" aria-label="Loading DevTinder">
    <div className="tinder-splash-mark">
      <BrandLogo size="xl" className="tinder-splash-logo rounded-[1.6rem] shadow-2xl ring-4 ring-white/25" />
      <p className="tinder-wordmark">DevTinder</p>
    </div>
  </div>
);

export default SplashScreen;
