import  { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignInNotification = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Only show if user is not authenticated and hasn't been shown before
    if (!isAuthenticated && !hasBeenShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasBeenShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || isAuthenticated) return null;

  return (
    <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-blue-600/90 to-cyan-600/90 backdrop-blur-md rounded-xl border border-blue-400/30 shadow-2xl p-4 max-w-sm">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors duration-300"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        
        <div className="pr-6">
          <h3 className="text-white font-semibold mb-2">🚀 Unlock All Features!</h3>
          <p className="text-blue-100 text-sm mb-4">
            Sign in to access our AI chatbot, exclusive content, and personalized experience.
          </p>
          
          <Link
            to="/signin"
            onClick={handleClose}
            className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
          >
            <span>Sign In Now</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInNotification;