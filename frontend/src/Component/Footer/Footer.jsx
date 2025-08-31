import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#011627] text-gray-300 border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Logo & About Section */}
                <div>
                    <h1 className="text-2xl font-bold text-[#82aaff]">MyWebsite</h1>
                    <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                        Download your favorite videos, audios, and reels instantly with our fast and secure downloader. Paste the link, choose your format, and get high-quality downloads from multiple platforms — all in one place, completely free!
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-lg font-semibold text-white">Quick Links</h2>
                    <ul className="mt-3 space-y-2">
                        <li className="hover:text-[#7fdbff] cursor-pointer transition">Home</li>
                        <li className="hover:text-[#7fdbff] cursor-pointer transition">About</li>
                        <li className="hover:text-[#7fdbff] cursor-pointer transition">Services</li>
                        <li className="hover:text-[#7fdbff] cursor-pointer transition">Contact</li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h2 className="text-lg font-semibold text-white">Follow Us</h2>
                    <div className="flex gap-5 mt-3">
                        <a href="#" className="hover:text-[#7fdbff] transition text-xl"><FaFacebook /></a>
                        <a href="#" className="hover:text-[#7fdbff] transition text-xl"><FaTwitter /></a>
                        <a href="#" className="hover:text-[#7fdbff] transition text-xl"><FaLinkedin /></a>
                        <a href="#" className="hover:text-[#7fdbff] transition text-xl"><FaGithub /></a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-700 mt-6 py-4 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} MyWebsite. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
