import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#07090e] py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-[#07090e] font-bold">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <span className="text-xl font-extrabold text-white tracking-wider">
                TALVIX
              </span>
            </a>
            <p className="text-gray-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Making every job application tailored, targeted, and powerful so
              no matter the competition, your talent gets noticed.
            </p>
            <div className="flex gap-4 pt-2 text-gray-400 text-base">
              <a href="#" className="hover:text-emerald-400 transition-colors">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                <i className="fa-brands fa-discord"></i>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <a
                  href="#features"
                  className="hover:text-emerald-400 transition-colors"
                >
                  AI Resume Builder
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-emerald-400 transition-colors"
                >
                  ATS Checker
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cover Letter Generator
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Career Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Resume Templates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  ATS Guide 2026
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cookie Settings
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>&copy; 2026 TALVIX AI Inc. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-400">
              Terms
            </a>
            <a href="#" className="hover:text-gray-400">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
