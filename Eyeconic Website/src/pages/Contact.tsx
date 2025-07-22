import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare, ShoppingCart } from 'lucide-react';
import DownloadSection from '../components/DownloadSection';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'purchase',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! We will contact you soon.');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["sales@eyeconic.edu", "support@eyeconic.edu"],
      description: "Get detailed information about pricing and availability"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["01272151734", "Mon-Fri 9AM-6PM EST"],
      description: "Speak directly with our sales team"
    },
    {
      icon: MapPin,
      title: "Visit Our Lab",
      details: ["Faculty of Engineering", "Suez Canal University "],
      description: "Schedule a demo and see Eyeconic in person"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Get Your Eyeconic
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to step into the future of augmented reality? Contact us to learn about 
            purchasing options, schedule a demo, or get answers to your questions.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                How to Reach Us
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Multiple ways to connect with our team
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <info.icon className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{info.title}</h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-300 font-medium">{detail}</p>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-r from-gray-800/30 to-gray-800/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Send Us a Message
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <div className="relative">
                    <ShoppingCart className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    >
                      <option value="purchase">Purchase Inquiry</option>
                      <option value="demo">Schedule Demo</option>
                      <option value="technical">Technical Questions</option>
                      <option value="partnership">Partnership</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none"
                    placeholder="Tell us about your interest in Eyeconic AR glasses..."
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Get In Touch & Location */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Visit Our Campus
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Connect with our team and visit our lab
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Campus Location</h3>
                  <p className="text-gray-300">
                    Faculty of Engineering<br />
                    Suez Canal University<br />
                    Computers & Control Wing
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Contact</h3>
                  <p className="text-gray-300">
                    01272151734<br />
                    Available: Mon-Fri 9AM-6PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                  <p className="text-gray-300">
                    team@eyeconic.edu<br />
                    info@eyeconic.edu
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Visit Our Lab</h3>
              <div className="aspect-video rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-400 text-center">
                  
                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6357.8239689685015!2d32.2692597105743!3d30.623824434329965!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f85983ce774def%3A0x4f6d0663e9e4c77a!2sFaculty%20of%20Engineering%20-%20Suez%20Canal%20University!5e1!3m2!1sen!2seg!4v1751814722121!5m2!1sen!2seg" width="550" height="400"></iframe>
                </p>
              </div>
              <p className="text-gray-300 text-sm">
                Schedule a visit to see Eyeconic in action and meet our team in person. 
                We love sharing our passion for AR technology!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Information */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl p-8 md:p-12 border border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Purchase Information</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Eyeconic AR glasses are currently in the final stages of development. 
                Contact us to join our early access program and be notified when they become available.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">Q2 2024</div>
                <div className="text-gray-300 mb-2">Expected Launch</div>
                <div className="text-gray-400 text-sm">Limited initial production run</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-cyan-400 mb-2">Early Access</div>
                <div className="text-gray-300 mb-2">Pre-order Program</div>
                <div className="text-gray-400 text-sm">Exclusive benefits and pricing</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">Demo</div>
                <div className="text-gray-300 mb-2">Try Before You Buy</div>
                <div className="text-gray-400 text-sm">Schedule a personal demonstration</div>
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

export default Contact;