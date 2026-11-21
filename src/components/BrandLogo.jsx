const sizes = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-24 w-24",
};

const BrandLogo = ({ size = "md", className = "" }) => (
  <img
    src="/Logo.png"
    alt="DevTinder"
    className={`${sizes[size] || sizes.md} rounded-2xl object-cover ${className}`.trim()}
  />
);

export default BrandLogo;
