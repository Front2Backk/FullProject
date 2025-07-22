import React, { useState, useRef, useEffect } from 'react';
import { Eye, Cpu, Battery, Wifi, Camera, Headphones, Shield, Zap, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import DownloadSection from '../components/DownloadSection';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const Product = () => {
  const [activeTab, setActiveTab] = useState('specs');
  const [currentView, setCurrentView] = useState('front');
  const productDisplayRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance required to trigger view change
  const minSwipeDistance = 50;

  const views = {
    front: {
      label: 'Front View',
      image: 'https://i.postimg.cc/pVmztsQK/Front.png' 
    },
    back: {
      label: 'Back View',
      image: 'https://i.postimg.cc/15PFNyhr/back.png' 
    },
    top: {
      label: 'Top View',
      image: 'https://i.postimg.cc/Prk7pv5V/up.png' 
    },
    right: {
      label: 'Right Side View',
      image: 'https://i.postimg.cc/qvKdVHqW/right.png' 
    }
  };

  const specifications = [
    {
      category: "Microprocessor",
      items: [
        { label: "Model", value: "Raspberry Pi 4 Model B (8GB)" },
        { label: "CPU", value: "Quad-core Cortex-A72 @ 1.5 GHz" },
        { label: "GPU", value: "VideoCore VI @ 500 MHz" },
        { label: "RAM", value: "8GB LPDDR4-2400 SDRAM" },
        { label: "Power Consumption", value: "3.4–7.6W" }
      ]
    },
    {
      category: "Camera Module",
      items: [
        { label: "Model", value: "Raspberry Pi Camera Module V3" },
        { label: "Sensor", value: "Sony IMX708, 12.3MP" },
        { label: "Resolution", value: "4608 × 2592 (stills), 1920 × 1080 (video)" },
        { label: "Frame Rate", value: "30 fps (1080p)" },
        { label: "Interface", value: "MIPI CSI-2" }
      ]
    },
    {
      category: "Display Module",
      items: [
        { label: "Model", value: "2.8-inch HDMI LCD" },
        { label: "Resolution", value: "480 × 320" },
        { label: "Panel Type", value: "IPS" },
        { label: "Touchscreen", value: "Capacitive" },
        { label: "Power Consumption", value: "0.5–1W" }
      ]
    },
    {
      category: "Audio Components",
      items: [
        { label: "Microphone", value: "BOYA Wireless (2.4 GHz, 48 kHz)" },
        { label: "Speaker", value: "Generic 1W mono (200 Hz–20 kHz)" },
        { label: "Microphone Range", value: "50m" },
        { label: "Microphone Battery", value: "9-hour" }
      ]
    },
    {
      category: "Power & Storage",
      items: [
        { label: "Battery", value: "Anker PowerCore 20000 (20,000 mAh)" },
        { label: "Storage", value: "32GB microSD (100 MB/s)" },
        { label: "Battery Output", value: "30W" },
        { label: "Dimensions", value: "150 × 62 × 26 mm" }
      ]
    }
  ];

  const features = [
    {
      icon: Cpu,
      title: "Powerful Processing",
      description: "Quad-core Cortex-A72 CPU provides sufficient performance for AR proof-of-concept applications."
    },
    {
      icon: Camera,
      title: "High-Quality Imaging",
      description: "12.3MP camera with autofocus captures clear images for AR object recognition and tracking."
    },
    {
      icon: Eye,
      title: "Compact Display",
      description: "2.8-inch touchscreen provides intuitive interaction with AR elements in a portable form factor."
    },
    {
      icon: Headphones,
      title: "Wireless Audio",
      description: "BOYA wireless microphone enables voice commands while maintaining mobility."
    },
    {
      icon: Battery,
      title: "Extended Battery Life",
      description: "20,000 mAh power bank ensures all-day operation for field testing."
    },
    {
      icon: Wifi,
      title: "Connectivity Options",
      description: "Multiple interfaces including HDMI, USB 3.0, and GPIO for flexible component integration."
    }
  ];

 const useCases = [
    {
      title: "Real-Time OCR",
      description: "Instantly read and digitize text from books, documents, signs, and any printed material in your field of view. Perfect for students, researchers, and professionals who need quick text extraction.",
      icon: Eye,
      features: [
        "Multi-language text recognition",
        "Real-time text highlighting",
        "Copy to clipboard functionality",
        "Handwriting recognition support"
      ]
    },
    {
      title: "Live Translation",
      description: "Break language barriers with instant translation of text, signs, menus, and conversations. Supports over 100 languages with real-time overlay translation directly in your view.",
      icon: Wifi,
      features: [
        "100+ language support",
        "Conversation mode",
        "Offline translation capability",
        "Cultural context awareness"
      ]
    },
    {
      title: "Object Recognition",
      description: "Identify and learn about objects, landmarks, plants, animals, and products around you. Get instant information, reviews, and contextual data about anything you see.",
      icon: Camera,
      features: [
        "Visual search capabilities",
        "Product information & reviews",
        "Educational content overlay",
        "Navigation assistance"
      ]
    }
  ];

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - cycle to next view
      const viewKeys = Object.keys(views);
      const currentIndex = viewKeys.indexOf(currentView);
      const nextIndex = (currentIndex + 1) % viewKeys.length;
      setCurrentView(viewKeys[nextIndex]);
    } else if (isRightSwipe) {
      // Swipe right - cycle to previous view
      const viewKeys = Object.keys(views);
      const currentIndex = viewKeys.indexOf(currentView);
      const prevIndex = (currentIndex - 1 + viewKeys.length) % viewKeys.length;
      setCurrentView(viewKeys[prevIndex]);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const viewKeys = Object.keys(views);
      const currentIndex = viewKeys.indexOf(currentView);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // Next view
        const nextIndex = (currentIndex + 1) % viewKeys.length;
        setCurrentView(viewKeys[nextIndex]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        // Previous view
        const prevIndex = (currentIndex - 1 + viewKeys.length) % viewKeys.length;
        setCurrentView(viewKeys[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AR Prototype System
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                A practical augmented reality prototype built with accessible components. 
                Demonstrates AR capabilities using cost-effective, locally available hardware.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/contact"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <span>Contact to Learn More</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">12.3MP</div>
                  <div className="text-gray-400 text-sm">Camera Resolution</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">8GB</div>
                  <div className="text-gray-400 text-sm">RAM Capacity</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">20Ah</div>
                  <div className="text-gray-400 text-sm">Battery Capacity</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Interactive Product Display */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-3xl animate-pulse"></div>
                
                {/* Swipeable Product Display */}
                <div 
                  ref={productDisplayRef}
                  className="relative z-10 overflow-hidden rounded-2xl border border-gray-700 shadow-2xl"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="relative w-full h-80 bg-gray-900 flex items-center justify-center">
                    {/* Placeholder for product image - replace with your actual image URLs */}
                    <img
                      src={views[currentView].image}
                      alt={`AR Glasses ${views[currentView].label}`}
                      className="w-full h-full object-contain transition-opacity duration-500"
                    />
                    
                    {/* View indicator */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {Object.keys(views).map((view) => (
                        <button
                          key={view}
                          onClick={() => setCurrentView(view)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentView === view ? 'bg-blue-400 w-4' : 'bg-gray-600'
                          }`}
                          aria-label={`Show ${views[view].label}`}
                        />
                      ))}
                    </div>
                    
                    {/* View label */}
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full">
                      <span className="text-sm text-white">{views[currentView].label}</span>
                    </div>
                    
                    {/* Navigation arrows for desktop */}
                    <button 
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hidden md:block"
                      onClick={() => {
                        const viewKeys = Object.keys(views);
                        const currentIndex = viewKeys.indexOf(currentView);
                        const prevIndex = (currentIndex - 1 + viewKeys.length) % viewKeys.length;
                        setCurrentView(viewKeys[prevIndex]);
                      }}
                    >
                      <ArrowRight className="h-5 w-5 text-white transform rotate-180" />
                    </button>
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hidden md:block"
                      onClick={() => {
                        const viewKeys = Object.keys(views);
                        const currentIndex = viewKeys.indexOf(currentView);
                        const nextIndex = (currentIndex + 1) % viewKeys.length;
                        setCurrentView(viewKeys[nextIndex]);
                      }}
                    >
                      <ArrowRight className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">
                    Swipe or click dots to view different angles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'specs', label: 'Specifications' },
              { id: 'features', label: 'Features' },
              { id: 'use-cases', label: 'Use Cases' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'specs' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Technical Specifications
                  </span>
                </h2>
                <p className="text-xl text-gray-400">Practical components selected for accessibility and performance</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {specifications.map((category, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-blue-400 mb-4">{category.category}</h3>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-start">
                          <span className="text-gray-300 text-sm">{item.label}</span>
                          <span className="text-white text-sm font-medium text-right ml-4">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Key Features
                  </span>
                </h2>
                <p className="text-xl text-gray-400">Balanced performance and practicality</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'use-cases' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Practical Applications
                  </span>
                </h2>
                <p className="text-xl text-gray-400">Demonstrating AR capabilities with accessible hardware</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="group p-8 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-6xl mb-6 text-center">{useCase.image}</div>
                    <h3 className="text-2xl font-semibold text-white mb-4 text-center">{useCase.title}</h3>
                    <p className="text-gray-300 text-center leading-relaxed">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Interested in AR Prototyping?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Learn how to build affordable AR systems with accessible components. 
            Contact us for more information about this prototype and its implementation.
          </p>
          
          <Link
            to="/contact"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>Get in Touch</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <DownloadSection />
      <Footer/>
      <ChatBot/>
    </div>
  );
};

export default Product;
