import React from 'react';
import { X, Mail, Phone, Linkedin, Github } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  education: string;
}

interface TeamMemberModalProps {
  member: TeamMember;
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-300 z-10"
        >
          <X className="h-5 w-5 text-gray-300" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400/30 flex-shrink-0">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{member.name}</h2>
              <p className="text-xl text-blue-400 mb-3">{member.role}</p>
              <p className="text-gray-300 leading-relaxed">{member.bio}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">{member.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span className="text-gray-300">{member.phone}</span>
              </div>
              {member.linkedin && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-4 w-4 text-blue-400" />
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {member.github && (
                <div className="flex items-center space-x-3">
                  <Github className="h-4 w-4 text-gray-400" />
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
                    GitHub Profile
                  </a>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Education</h3>
              <p className="text-gray-300 mb-4">{member.education}</p>
              
              <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-400/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;