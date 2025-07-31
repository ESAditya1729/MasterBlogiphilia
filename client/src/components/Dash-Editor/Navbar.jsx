// src/components/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-40">
      {/* Logo/Brand */}
      <div className="flex items-center space-x-2">
        <span
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-indigo-600 cursor-pointer hover:text-indigo-800 transition"
        >
          Blogiphilia
        </span>
      </div>

      {/* Navigational Buttons */}
      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        {/* Profile Avatar */}
        <div
          className="ml-4 w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-300 transition"
          title="Profile"
        >
          {/* Replace with actual avatar image if logged in */}
          <span className="text-lg font-semibold">B</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
