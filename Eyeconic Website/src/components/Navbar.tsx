import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Download,
  ChevronDown,
  User,
  MessageCircle,
  Package,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import UserProfile from "./UserProfile";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, markUserAsExperienced } = useAuth();
  const { openChat } = useChat();

  // Mark user as experienced after they've seen the highlighted features
  useEffect(() => {
    if (isAuthenticated && user?.isNewUser) {
      const timer = setTimeout(() => {
        markUserAsExperienced();
      }, 10000); // Remove highlighting after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.isNewUser, markUserAsExperienced]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToDownload = () => {
    const downloadSection = document.getElementById("download-section");
    if (downloadSection) {
      downloadSection.scrollIntoView({ behavior: "smooth" });
      // Close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  const handleChatbotClick = () => {
    if (!isAuthenticated) {
      alert("Please sign in to use the chatbot feature.");
      return;
    }
    openChat();
  };

  const baseNavItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Features dropdown items (only for authenticated users)
  const featuresItems = [
    {
      name: "Product",
      path: "/product",
      icon: Package,
      description: "Explore our AR glasses",
    },
    {
      name: "Our Chatbot",
      path: "/chat",
      icon: MessageCircle,
      description: "AI-powered assistant",
      highlight: true, // Special highlight for chatbot
    },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center group">
              <img
                src="/WhatsApp Image 2025-06-30 at 03.44.01_68652aa2-Photoroom.png"
                alt="Eyeconic Logo"
                className="h-[90px] w-[90px] object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {baseNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-blue-400 ${
                    location.pathname === item.path
                      ? "text-blue-400 bg-blue-400/10"
                      : "text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Features Dropdown for Authenticated Users */}
              {isAuthenticated ? (
                <div className="relative">
                  {/* Hover area that includes both button and dropdown */}
                  <div
                    onMouseEnter={() => setShowFeaturesDropdown(true)}
                    onMouseLeave={() => setShowFeaturesDropdown(false)}
                  >
                    <button
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        isAuthenticated && user?.isNewUser
                          ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-400/30 hover:border-blue-400/50 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                          : isAuthenticated
                          ? "text-gray-300 hover:text-blue-400 hover:bg-gray-800/50"
                          : "text-gray-300 hover:text-blue-400 hover:bg-gray-800/50"
                      }`}
                    >
                      <span>Our Features</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          showFeaturesDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 transition-all duration-300 ${
                        showFeaturesDropdown
                          ? "opacity-100 visible transform translate-y-0"
                          : "opacity-0 invisible transform -translate-y-2"
                      }`}
                    >
                      <div className="bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl py-2 z-50">
                        {featuresItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 transition-all duration-300 ${
                              item.highlight
                                ? user?.isNewUser
                                  ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-l-4 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                                  : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border-l-4 border-blue-400"
                                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                            }`}
                            onClick={() => setShowFeaturesDropdown(false)}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                item.highlight
                                  ? "bg-gradient-to-r from-blue-400/50 to-cyan-400/50"
                                  : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20"
                              }`}
                            >
                              <item.icon
                                className={`h-4 w-4 ${
                                  item.highlight
                                    ? "text-white"
                                    : "text-blue-400"
                                }`}
                              />
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div
                                className={`text-xs ${
                                  item.highlight
                                    ? "text-blue-200"
                                    : "text-gray-400"
                                }`}
                              >
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Show Product link for non-authenticated users
                <Link
                  to="/product"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-blue-400 ${
                    location.pathname === "/product"
                      ? "text-blue-400 bg-blue-400/10"
                      : "text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  Product
                </Link>
              )}

              <button
                onClick={() => {
                  const downloadSection = document.getElementById("download");
                  if (downloadSection) {
                    downloadSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>Download App</span>
              </button>

              {/* Auth Section */}
              {isAuthenticated ? (
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="flex items-center space-x-2 p-2 rounded-lg  transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border-4 border-blue-400/30 ">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm">{user?.name}</span>
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/95 backdrop-blur-md rounded-lg mt-2">
                {baseNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? "text-blue-400 bg-blue-400/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Features Section */}
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-gray-400 text-sm font-medium">
                      Our Features
                    </div>
                    {featuresItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-6 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                          item.highlight
                            ? user?.isNewUser
                              ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                              : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white"
                            : "text-gray-300 hover:text-white hover:bg-gray-700"
                        }`}
                      >
                        <item.icon
                          className={`h-4 w-4 ${
                            item.highlight ? "text-white" : "text-blue-400"
                          }`}
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    to="/product"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                      location.pathname === "/product"
                        ? "text-blue-400 bg-blue-400/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    Product
                  </Link>
                )}

                <button
                  onClick={scrollToDownload}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 rounded-md text-base font-medium mt-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download App</span>
                </button>

                {/* Mobile Auth Section */}
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setShowUserProfile(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 mt-2"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-400/30">
                      <img
                        src={
                          user?.avatar ||
                          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
                        }
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>Profile</span>
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-700/50 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-300 mt-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </>
  );
};

export default Navbar;
