import React, { useState, useEffect } from "react";
import { User, Settings, LogOut, Edit3, Save, X, Camera } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    // email: '',
    // firstName: '',
    // lastName: ''
  });

  // Update editForm when user changes
  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || "",
        // email: user.email || '',
        // firstName: user.firstName || '',
        // lastName: user.lastName || ''
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      username: user.username || "",
      // email: user.email || '',
      // firstName: user.firstName || '',
      // lastName: user.lastName || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full">
        {/* Close Button */}
        <button
          title="x"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-300"
        >
          <X className="h-5 w-5 text-gray-300" />
        </button>

        <div className="p-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400/30 mx-auto mb-4">
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
              <button
                title="camera"
                className="absolute bottom-4 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>

            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user.username}
                </h2>
              </>
            ) : (
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="Username"
                />
              </div>
            )}
          </div>

          {/* Member Since */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-300">Last Login</span>
              </div>
              <span className="text-white">
                {new Date(user.joinedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center space-x-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-blue-400/30"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-red-400/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-green-400/30"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-gray-400/30"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
