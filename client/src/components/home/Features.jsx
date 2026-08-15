import React from "react";
import { Zap } from "lucide-react";
import Title from "./Title";

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <i className="fa-solid fa-sparkles"></i> Simple & Powerful Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Build your job-winning resume with intelligent precision
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Our streamlined AI engine analyzes employer job descriptions and
            generates optimized resumes formatted to beat Applicant Tracking
            Systems (ATS).
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-8 rounded-3xl relative group overflow-hidden border border-white/5 hover:border-emerald-500/30">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-[#07090e] transition-all duration-300">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Real-Time ATS Analytics
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Get instant score feedback matching your resume against recruiter
              search algorithms before hitting apply.
            </p>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
                Instant Keyword Parsing
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
                Format & Typography Check
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-8 rounded-3xl relative group overflow-hidden border border-white/5 hover:border-emerald-500/30">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-[#07090e] transition-all duration-300">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Bank-Grade Privacy
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              End-to-end encryption guarantees your career history, personal
              contact info, and metrics remain 100% private.
            </p>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-emerald-400"></i>
                SOC-2 Compliant Architecture
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-emerald-400"></i>
                Zero Data Selling
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-8 rounded-3xl relative group overflow-hidden border border-white/5 hover:border-emerald-500/30">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-2xl mb-6 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-[#07090e] transition-all duration-300">
              <i className="fa-solid fa-file-export"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Customizable Exports
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Export pixel-perfect PDF, Word, or shareable web-ready links with
              custom portfolio integrations in one click.
            </p>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
                Clean Vector PDFs
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
                Multi-column Layout Support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
