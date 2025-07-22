import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, Zap, Wifi, Battery, Cpu, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import DownloadSection from '../components/DownloadSection';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const Home = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [currentSpecIndex, setCurrentSpecIndex] = useState(0);

  const animatedWords = [
    'Revolutionary',
    'Innovative', 
    'Intelligent',
    'Immersive',
    'Advanced',
    'Futuristic',
    'Cutting-edge',
    'Next-gen'
  ];

  const arSpecs = [
  {
    title: 'Microprocessor',
    code: [
      '// Raspberry Pi 4 Model B (8GB)',
      'const processor = {',
      '  cpu: "Quad-core Cortex-A72 @ 1.5GHz",',
      '  gpu: "VideoCore VI @ 500MHz",',
      '  ram: "8GB LPDDR4-2400 SDRAM",',
      '  power: "3.4–7.6W",',
      '  interfaces: [',
      '    "40-pin GPIO",',
      '    "2× micro-HDMI",',
      '    "2× USB 3.0",',
      '    "MIPI CSI-2",',
      '    "MIPI DSI"',
      '  ],',
      '  dimensions: "85.6 × 56.5 × 17mm"',
      '};'
    ]
  },
  {
    title: 'Camera Module',
    code: [
      '// Raspberry Pi Camera Module V3',
      'const camera = {',
      '  sensor: "Sony IMX708, 12.3MP",',
      '  resolution: {',
      '    stills: "4608 × 2592",',
      '    video: "1920 × 1080"',
      '  },',
      '  frameRate: "30fps @ 1080p",',
      '  lens: {',
      '    type: "autofocus",',
      '    fov: "75°"',
      '  },',
      '  interface: "MIPI CSI-2"',
      '};'
    ]
  },
  {
    title: 'Display Module',
    code: [
      '// 2.8-inch HDMI LCD',
      'const display = {',
      '  size: "2.8-inch",',
      '  resolution: "480 × 320",',
      '  panel: "IPS",',
      '  touchscreen: "capacitive",',
      '  interface: "HDMI",',
      '  power: "0.5–1W",',
      '  performance: {',
      '    refreshRate: "60Hz",',
      '    touchLatency: "<10ms"',
      '  }',
      '};'
    ]
  },
  {
    title: 'Audio Components',
    code: [
      '// Audio System Configuration',
      'const audio = {',
      '  microphone: {',
      '    model: "BOYA Wireless",',
      '    frequency: "48kHz",',
      '    range: "50m",',
      '    battery: "9-hour"',
      '  },',
      '  speaker: {',
      '    power: "1W mono",',
      '    frequencyRange: "200Hz–20kHz",',
      '    connection: "3.5mm jack"',
      '  }',
      '};'
    ]
  },
  {
    title: 'Power & Storage',
    code: [
      '// Power and Storage System',
      'const powerStorage = {',
      '  battery: {',
      '    model: "Anker PowerCore 20000",',
      '    capacity: "20,000mAh (74Wh)",',
      '    output: "30W",',
      '    dimensions: "150 × 62 × 26mm"',
      '  },',
      '  storage: {',
      '    type: "microSD",',
      '    capacity: "32GB",',
      '    speed: "100MB/s"',
      '  }',
      '};'
    ]
  }
];

  // Animate words with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % animatedWords.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [animatedWords.length]);

  // Animate code typing and erasing
  useEffect(() => {
    const currentSpec = arSpecs[currentSpecIndex];
    
    if (!isErasing && currentLineIndex < currentSpec.code.length) {
      const currentLine = currentSpec.code[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        const timeout = setTimeout(() => {
          setCodeLines(prev => {
            const newLines = [...prev];
            newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
            return newLines;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, Math.random() * 30 + 20);
        
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 200);
        
        return () => clearTimeout(timeout);
      }
    } else if (!isErasing && currentLineIndex >= currentSpec.code.length) {
      const timeout = setTimeout(() => {
        setIsErasing(true);
      }, 2000);
      
      return () => clearTimeout(timeout);
    } else if (isErasing) {
      const timeout = setTimeout(() => {
        if (codeLines.length > 0) {
          setCodeLines(prev => prev.slice(0, -1));
        } else {
          setIsErasing(false);
          setCurrentLineIndex(0);
          setCurrentCharIndex(0);
          setCurrentSpecIndex(prev => (prev + 1) % arSpecs.length);
        }
      }, 50);
      
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, isErasing, currentSpecIndex, codeLines.length, arSpecs]);

  const features = [
  {
    icon: Eye,
    title: "Compact AR Display",
    description: "2.8-inch HDMI IPS touchscreen, 480×320 resolution, 60Hz refresh rate",
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    icon: Zap,
    title: "Reliable Edge Performance",
    description: "Powered by Raspberry Pi 4 (8GB), quad-core CPU and VideoCore VI GPU",
    image: "https://images.pexels.com/photos/159201/circuit-circuit-board-resistor-computer-159201.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    icon: Wifi,
    title: "Flexible I/O & Connectivity",
    description: "Dual-band Wi-Fi, Bluetooth 5.0, USB 3.0, HDMI, and 40-pin GPIO support",
    image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    icon: Battery,
    title: "High-Capacity Battery",
    description: "Anker PowerCore 20000mAh with 30W output for extended field use",
    image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

  const renderCodeLine = (line: string, index: number) => {
    if (!line) return <span className="text-gray-300"></span>;

    if (line.includes('//')) {
      return <span className="text-green-400">{line}</span>;
    } else if (line.includes('const')) {
      const parts = line.split('const ');
      return (
        <>
          <span className="text-purple-400">const</span>
          <span className="text-gray-300"> {parts[1] || ''}</span>
        </>
      );
    } else if (line.includes('class')) {
      const parts = line.split('class ');
      return (
        <>
          <span className="text-blue-400">class</span>
          <span className="text-yellow-400"> {parts[1] || ''}</span>
        </>
      );
    } else if (line.includes('constructor') || line.includes('async')) {
      return <span className="text-purple-400">{line}</span>;
    } else if (line.includes('this.')) {
      const parts = line.split('.');
      return (
        <>
          <span className="text-blue-300">{parts[0] || ''}.</span>
          <span className="text-cyan-400">{parts.slice(1).join('.') || ''}</span>
        </>
      );
    } else if (line.includes('"')) {
      return line.split('"').map((part, i) => 
        i % 2 === 1 ? (
          <span key={i} className="text-green-300">"{part}"</span>
        ) : (
          <span key={i} className="text-gray-300">{part}</span>
        )
      );
    } else if (line.includes('console.log')) {
      const parts = line.split('console.log');
      return (
        <>
          <span className="text-blue-300">console</span>
          <span className="text-gray-300">.</span>
          <span className="text-yellow-400">log</span>
          <span className="text-gray-300">{parts[1] || ''}</span>
        </>
      );
    } else {
      return <span className="text-gray-300">{line}</span>;
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Animated text */}
            <div className="z-10">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <div className="inline-flex flex-wrap items-baseline">
                    <span className="text-white">We Build&nbsp;</span>
                    <div className="relative inline-block h-[1em] align-baseline z-[999]">
                      {animatedWords.map((word, index) => (
                        <span
                          key={word}
                          className={`absolute left-0 top-0 whitespace-nowrap bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500 ease-in-out ${
                            currentWordIndex === index
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{ 
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            lineHeight: '1.14em'
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                    <span className="text-white">&nbsp;AR Experiences</span>
                  </div>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Eyeconic is a team of 13 brilliant students engineering the future of augmented reality. 
                From revolutionary hardware to intelligent software, we deliver next-generation AR solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-start items-start mb-16">
                <Link
                  to="/product"
                  className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-lg"
                >
                  <span>Explore Product</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link
                  to="/about"
                  className="group border-2 border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Meet Our Team
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <div className="text-2xl font-bold text-blue-400">480×320</div>
                  <div className="text-gray-400 text-sm">Display Resolution</div>
                </div>
                <div className="p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <div className="text-2xl font-bold text-cyan-400">9h</div>
                  <div className="text-gray-400 text-sm">Audio Battery</div>
                </div>
                <div className="p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <div className="text-2xl font-bold text-blue-400">1.5GHz</div>
                  <div className="text-gray-400 text-sm">CPU Speed</div>
                </div>
              </div>
            </div>

            {/* Right side - Live AR specs coding animation */}
            <div className="relative z-10 mt-12">
              <div className="relative max-w-lg mx-auto">
                {/* Terminal window */}
                <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-gray-400 text-sm font-mono">
                      {arSpecs[currentSpecIndex]?.title?.toLowerCase().replace(' ', '-') || 'eyeconic'}.js
                    </div>
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <Eye className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  
                  {/* Code content */}
                  <div className="p-6 h-96 overflow-hidden">
                    <div className="font-mono text-sm space-y-1">
                      {codeLines.map((line, index) => (
                        <div key={index} className="flex items-center min-h-[20px]">
                          <span className="text-gray-500 w-8 text-right mr-4 select-none">
                            {line && line.trim() ? index + 1 : ''}
                          </span>
                          <span className="text-gray-300">
                            {renderCodeLine(line, index)}
                          </span>
                          {index === currentLineIndex && currentCharIndex === (line?.length || 0) && !isErasing && (
                            <span className="inline-block w-2 h-5 bg-blue-400 ml-1 animate-pulse"></span>
                          )}
                        </div>
                      ))}
                      
                      {/* Show current spec title */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-xs text-gray-500 bg-gray-800/80 px-3 py-1 rounded-full text-center">
                          {arSpecs[currentSpecIndex]?.title || 'Eyeconic'} Specifications
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating spec indicators */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
                  <span className="text-blue-400 font-mono text-xs">AR</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
                  <span className="text-cyan-400 font-mono text-xs">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Engineered with precision, designed for the future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Showcase */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Student Innovation
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Born from academic excellence and fueled by innovation, Eyeconic represents 
                the pinnacle of student engineering achievement.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Custom silicon designed in-house</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-cyan-400" />
                  <span className="text-gray-300">Seamless mobile integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Intuitive gesture recognition</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-2xl"></div>
              <div className="relative z-10 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Team Innovation"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-400 mb-2">1 Years</div>
                      <div className="text-gray-300">Development Time</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-cyan-400 mb-2">13</div>
                      <div className="text-gray-300">Team Members</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-400 mb-2">Many</div>
                      <div className="text-gray-300">Prototypes</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-cyan-400 mb-2">∞</div>
                      <div className="text-gray-300">Possibilities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DownloadSection />
      <Footer/>
      <ChatBot/>
    </div>
  );
};

export default Home;
