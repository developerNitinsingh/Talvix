const Logo = ({ className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 font-bold text-xl sm:text-2xl tracking-[0.12em] text-slate-800 select-none ${className}`}
  >
    TAL
    <span className="text-green-600">VIX</span>
    <span
      className="size-2 rounded-full bg-green-500 shrink-0"
      aria-hidden="true"
    />
  </span>
);

export default Logo;
