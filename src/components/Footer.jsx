const Footer = () => {
  return (
    <footer className="mt-auto flex w-full items-center justify-center gap-3 bg-base-300 px-4 py-4 text-sm">
      <img src="/Logo.png" alt="" className="h-7 w-7 rounded-md object-cover" />
      <p>Copyright © {new Date().getFullYear()} DevTinder</p>
    </footer>
  );
};

export default Footer;
