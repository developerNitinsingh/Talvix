import React from "react";

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-10 sm:p-16 border border-emerald-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 relative z-10 leading-tight">
            Build a Professional Resume That Helps You{" "}
            <br className="hidden sm:inline" />
            Stand Out and Get Hired.
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 relative z-10">
            Join over 25,000 job seekers who accelerated their careers using
            TALVIX AI engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href="/app"
              className="glow-button bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-[#07090e] font-extrabold px-8 py-4 rounded-xl text-base transition-all flex items-center gap-3"
            >
              <span>Get Started Now</span>
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
