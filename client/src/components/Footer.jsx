import React from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 pt-12 pb-6 px-6 md:px-10 mt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo and short description */}
        <div>
          <h3 className="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-2">
            Blogiphilia
          </h3>
          <p className="text-sm">
            A creative platform to write, connect, and inspire through stories.
            Built for the next generation of digital writers.
          </p>
        </div>

        {/* Navigation links */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Explore</h4>
          <ul className="text-sm space-y-1">
            <li><a href="#why-blogiphilia" className="hover:text-violet-600">Why Blogiphilia</a></li>
            <li><a href="#how-it-works" className="hover:text-violet-600">How It Works</a></li>
            <li><a href="#Feature" className="hover:text-violet-600">Features</a></li>
            <li><a href="#join" className="hover:text-violet-600">Join Now</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Connect</h4>
          <div className="flex justify-center md:justify-start gap-4 text-xl">
            <a href="#" aria-label="Twitter" className="hover:text-violet-600"><FaTwitter /></a>
            <a href="#" aria-label="GitHub" className="hover:text-violet-600"><FaGithub /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-violet-600"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-slate-300 dark:border-slate-700 pt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Blogiphilia. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
