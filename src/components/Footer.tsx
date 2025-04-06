import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="EXP3 Logo" className="h-10" />
            </Link>
            <p className="text-gray-400">
              Building the future of digital experiences through blockchain technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <a 
              href="mailto:expthree2024@gmail.com"
              className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              expthree2024@gmail.com
            </a>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="space-y-2">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors block">LINE</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors block">Discord</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors block">Telegram</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          © 2025 EXP3. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;