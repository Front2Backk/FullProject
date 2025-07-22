import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import Navbar from './components/Navbar';
// import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import SignInNotification from './components/SignInNotification';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Product from './pages/Product';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div 
            className="min-h-screen text-white bg-fixed bg-center bg-cover"
            style={{
              backgroundImage: "linear-gradient(rgba(17, 24, 39, 0.85), url('https://i.postimg.cc/yNZjy8rQ/20250706-1649-AR-Glasses-Night-Glow-simple-compose-01jzfztd3efn0atcc7b8ar0eb6.png')",
              backgroundBlendMode: 'overlay',
            }}
          >
            <ScrollToTop />
            <Navbar />
            <SignInNotification />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
            {/* <Footer /> */}
            {/* <ChatBot /> */}
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
