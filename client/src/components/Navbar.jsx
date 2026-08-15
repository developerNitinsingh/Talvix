import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/features/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/");
    dispatch(logout());
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 backdrop-blur-xl bg-[#07090e]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#07090e] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-all duration-300">
              <i className="fa-solid fa-bolt text-emerald-400 group-hover:text-white transition-colors"></i>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-wider text-white font-sans flex items-center gap-1">
              TALVIX
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </span>
            <span className="text-[9px] text-gray-400 tracking-widest uppercase font-semibold">
              Career Intelligence
            </span>
          </div>
        </a>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <p className="hidden sm:inline-flex text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Hi, {user?.name}
          </p>

          <button
            onClick={logoutUser}
            className="glow-button bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#07090e] font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-center gap-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
