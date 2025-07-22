import React from 'react';
import { Download, Smartphone, Star } from 'lucide-react';

const DownloadSection = () => {
  return (
    <section id="download" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Download Eyeconic App
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Take control of your AR glasses with our powerful companion app. Configure settings, 
            download AR experiences, and unlock the full potential of Eyeconic.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Mobile Control Hub</h3>
                <p className="text-gray-400">Complete control over your AR glasses from your smartphone</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AR Experience Store</h3>
                <p className="text-gray-400">Browse and download premium AR applications and games</p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">App Features:</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Real-time glasses status monitoring</li>
                <li>• Custom AR overlay configurations</li>
                <li>• Social sharing and collaboration tools</li>
                <li>• Cloud sync across all devices</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl">
              <Smartphone className="h-24 w-24 text-blue-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Download</h3>
              <p className="text-gray-400 mb-8">
                Compatible with iOS 12+ and Android 8+
              </p>
              
              <button 
                onClick={() => {
                  // Replace with your actual download link
                  window.open('#', '_blank');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
              >
                <Download className="h-5 w-5" />
                <span>Download Now</span>
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                Free download • No subscription required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;