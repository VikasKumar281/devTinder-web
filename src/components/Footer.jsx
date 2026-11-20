const Footer = () => {
  return (
    <footer className="mt-auto flex w-full items-center justify-between border-t border-white/10 bg-base-300/80 px-4 py-3 text-sm sm:px-6">
      <div className="flex items-center gap-2">
        <img src="/Logo.png" alt="" className="h-6 w-6 rounded-md object-cover" />
        <span className="font-medium">DevTinder</span>
      </div>
      <p className="opacity-60">© {new Date().getFullYear()} All rights reserved</p>
    </footer>
  );
};

export default Footer;
