const EmptyState = ({ title, text, emoji = "✦" }) => (
  <div className="mx-auto my-16 flex max-w-md flex-col items-center px-4 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-base-200 text-2xl shadow-xl">
      {emoji}
    </div>
    <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
    <p className="mt-2 text-sm leading-relaxed opacity-70">{text}</p>
  </div>
);

export default EmptyState;
