import React from "react";

const Banner = () => {
  return (
    <div className="relative z-50 bg-gradient-to-r from-emerald-950/80 via-[#0f141c] to-emerald-950/80 border-b border-emerald-500/20 py-2.5 px-4 text-center text-xs font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider animate-pulse">
          NEW v3.2
        </span>
        <span className="text-gray-300">
          AI Resume Optimizer with Live ATS Matching is here!
        </span>
      </div>
    </div>
  );
};

export default Banner;
