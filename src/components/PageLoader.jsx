import BrandLogo from "./BrandLogo";

export const withMinDelay = async (work, ms = 480) => {
  const started = Date.now();
  const result = typeof work === "function" ? await work() : await work;
  const wait = Math.max(0, ms - (Date.now() - started));
  if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
  return result;
};

const PageLoader = ({ label = "Loading", variant = "pulse" }) => {
  if (variant === "list") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="shimmer mb-2 h-3 w-16 rounded-full" />
            <div className="shimmer h-8 w-40 rounded-full" />
          </div>
          <div className="shimmer h-7 w-10 rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-base-200/80 p-4"
              style={{ animationDelay: `${item * 90}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="shimmer h-16 w-16 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <div className="shimmer mb-2 h-4 w-2/3 rounded-full" />
                  <div className="shimmer mb-2 h-3 w-1/3 rounded-full" />
                  <div className="shimmer h-3 w-full rounded-full" />
                </div>
              </div>
              <div className="shimmer mt-4 h-9 w-full rounded-full" />
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm opacity-60">{label}</p>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-10">
        <div className="relative h-[28rem] w-full max-w-[20rem]">
          <div className="shimmer absolute inset-0 rotate-[-6deg] rounded-[2rem] opacity-40" />
          <div className="shimmer absolute inset-0 rotate-[4deg] rounded-[2rem] opacity-70" />
          <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10 bg-base-200 p-6 shadow-2xl">
            <div className="shimmer mb-3 h-8 w-40 rounded-full" />
            <div className="shimmer mb-2 h-3 w-24 rounded-full" />
            <div className="shimmer mb-6 h-12 w-full rounded-2xl" />
            <div className="flex justify-center gap-6">
              <div className="shimmer h-16 w-16 rounded-full" />
              <div className="shimmer h-16 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <BrandLogo size="sm" className="rounded-lg" />
          <p className="text-sm font-medium tracking-wide opacity-70">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="loader-ring" />
        <span className="loader-ring loader-ring-delay" />
        <BrandLogo size="md" className="relative z-10 rounded-xl" />
      </div>
      <p className="text-sm font-medium tracking-[0.18em] uppercase opacity-70">{label}</p>
    </div>
  );
};

export default PageLoader;
