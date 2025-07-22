import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Product', path: '/product' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 relative mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src="/WhatsApp Image 2025-06-30 at 03.44.01_68652aa2-Photoroom.png" 
                alt="Eyeconic Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Revolutionary AR glasses designed by students, engineered for tomorrow. 
              Experience the future of augmented reality technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800/50 hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-700 hover:border-blue-400/50"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Faculty of Engineering</p>
                  <p className="text-gray-400 text-sm">Suez Canal University</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">01272151734</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">team@eyeconic.edu</p>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Project Info</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">Graduation Project</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  A collaborative effort by 13 engineering students to revolutionize AR technology.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-lg border border-blue-400/20">
                  <div className="text-lg font-bold text-blue-400">13</div>
                  <div className="text-xs text-gray-400">Team Members</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-lg border border-cyan-400/20">
                  <div className="text-lg font-bold text-cyan-400">2025</div>
                  <div className="text-xs text-gray-400">Launch Year</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Eyeconic AR Glasses. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Designed and developed by the Eyeconic Team
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={scrollToTop}
                className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300"
              >
                Back to Top ↑
              </button>
              <div className="flex space-x-4 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">Privacy</a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 opacity-30"></div>
    </footer>
  );
};

export default Footer;