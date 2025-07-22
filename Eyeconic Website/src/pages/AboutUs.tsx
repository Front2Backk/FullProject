import React, { useState } from "react";
import { Users, User, Award, Target, Heart, ArrowRight } from "lucide-react";
import DownloadSection from "../components/DownloadSection";
import TeamMemberModal from "../components/TeamMemberModal";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

const AboutUs = () => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: "Mohamed Gamal",
      role: "Web Developer",
      image: "/3.jpg",
      bio: "Project lead overseeing Eyeconic development",
      email: "m.dgamal456@gmail.com",
      phone: "01272151734",
      linkedin: "#",
      github: "#",
      skills: ["HTML", "CSS" ,"Javascript" ,"tailwindcss", "Flutter" ,"React"],
      education: "Computer Science",
    },
    {
      id: 2,
      name: "Ahmed Faheem",
      role: "Web Developer",
      image: "/5.jpg",
      bio: "Hardware specialist focusing on device components",
      email: "member2@eyeconic.edu",
      phone: "+1 (555) 222-2222",
      linkedin: "#",
      github: "#",
      skills: ["Circuit Design", "PCB Layout"],
      education: "Electrical Engineering",
    },
    {
      id: 3,
      name: "Hazem Mohy-Eldin",
      role: "Hardware Engineer",
      image: "/7.jpg",
      bio: "Hardware engineer working on device architecture",
      email: "member3@eyeconic.edu",
      phone: "+1 (555) 333-3333",
      linkedin: "#",
      github: "#",
      skills: ["Embedded Systems", "Signal Processing"],
      education: "Computer Engineering",
    },
    {
      id: 4,
      name: "Khaled Khedr",
      role: "Software Developer",
      image: "/6.jpg",
      bio: "Frontend developer creating user interfaces",
      email: "member4@eyeconic.edu",
      phone: "+1 (555) 444-4444",
      linkedin: "#",
      github: "#",
      skills: ["React", "TypeScript"],
      education: "Software Engineering",
    },
    {
      id: 5,
      name: "Momen Ehab",
      role: "Software Developer",
      image: "/10.jpg",
      bio: "Backend developer building server infrastructure",
      email: "member5@eyeconic.edu",
      phone: "+1 (555) 555-5555",
      linkedin: "#",
      github: "#",
      skills: ["Node.js", "Database Design"],
      education: "Computer Science",
    },
    {
      id: 6,
      name: "Abdelrahman Yasser",
      role: "Software Developer",
      image: "https://i.postimg.cc/RFFRqwtn/Whats-App-Image-2025-07-08-at-10-53-41-76d0870a.jpg",
      bio: "Full-stack developer integrating systems",
      email: "member6@eyeconic.edu",
      phone: "+1 (555) 666-6666",
      linkedin: "#",
      github: "#",
      skills: ["JavaScript", "API Development"],
      education: "Information Technology",
    },
    {
      id: 7,
      name: "Ahmed Essam",
      role: "Backend Development",
      image: "https://i.postimg.cc/QxTkw8s1/Whats-App-Image-2025-07-08-at-10-56-27-618a2e30.jpg",
      bio: "AR developer creating immersive experiences",
      email: "member7@eyeconic.edu",
      phone: "+1 (555) 777-7777",
      linkedin: "#",
      github: "#",
      skills: ["Unity", "3D Graphics"],
      education: "Computer Graphics",
    },
    {
      id: 8,
      name: "Mazen Osama",
      role: "Backend Developer",
      image: "/2.jpg",
      bio: "Computer vision engineer for AR tracking",
      email: "member8@eyeconic.edu",
      phone: "+1 (555) 888-8888",
      linkedin: "#",
      github: "#",
      skills: ["OpenGL", "Computer Vision"],
      education: "Computer Science",
    },
    {
      id: 9,
      name: "Ahmed Osama",
      role: "Backend Developer",
      image: "/8.jpg",
      bio: "AR interaction designer",
      email: "member9@eyeconic.edu",
      phone: "+1 (555) 999-9999",
      linkedin: "#",
      github: "#",
      skills: ["ARKit", "ARCore"],
      education: "Human-Computer Interaction",
    },
    {
      id: 10,
      name: "Hussein Mohsen",
      role: "Network & Security",
      image: "/1.jpg",
      bio: "User interface designer",
      email: "member10@eyeconic.edu",
      phone: "+1 (555) 101-1010",
      linkedin: "#",
      github: "#",
      skills: ["Figma", "Prototyping"],
      education: "Design",
    },
    {
      id: 11,
      name: "Ahmed Abdelnasser",
      role: "Mobile Application",
      image: "/11.jpg",
      bio: "User experience researcher",
      email: "member11@eyeconic.edu",
      phone: "+1 (555) 111-1111",
      linkedin: "#",
      github: "#",
      skills: ["User Research", "Testing"],
      education: "Psychology",
    },
    {
      id: 12,
      name: "Ahmed Habib",
      role: "Mobile Application",
      image: "/4.jpg",
      bio: "Coordinates development and releases",
      email: "member12@eyeconic.edu",
      phone: "+1 (555) 121-2121",
      linkedin: "#",
      github: "#",
      skills: ["Agile", "Scrum"],
      education: "Business Administration",
    },
    {
      id: 13,
      name: "Ziad tamer",
      role: "Mobile Application",
      image: "/9.jpg",
      bio: "Ensures product quality and testing",
      email: "member13@eyeconic.edu",
      phone: "+1 (555) 131-3131",
      linkedin: "#",
      github: "#",
      skills: ["Testing", "Automation"],
      education: "Computer Science",
    },
  ];

  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We push the boundaries of what's possible in AR technology",
    },
    {
      icon: Users,
      title: "Collaborative Spirit",
      description:
        "Our diverse team brings together unique perspectives and expertise",
    },
    {
      icon: Award,
      title: "Academic Excellence",
      description: "Rooted in rigorous research and academic achievement",
    },
    {
      icon: Heart,
      title: "User-Centric Design",
      description:
        "Every decision is made with the end-user experience in mind",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section with Team Image */}
      <section className="py-20 bg-gradient-to-br">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                About Eyeconic
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We are a passionate team of 13 students united by a shared vision:
              to revolutionize how humans interact with digital information
              through cutting-edge augmented reality technology.
            </p>
          </div>

          {/* Team Photo */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-2xl"></div>
            <div className="relative z-10 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Eyeconic Team"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  The Eyeconic Team
                </h3>
                <p className="text-gray-300">
                  13 brilliant minds working together to shape the future of AR
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Our Mission & Values
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Driven by innovation, guided by purpose
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Story Section */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-2xl p-8 md:p-12 border border-gray-700">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Our Journey
                </h3>
                <p className="text-gray-300 mb-6">
                  What started as a ambitious graduation project has evolved
                  into a revolutionary AR platform. Our team of dedicated
                  students from diverse engineering backgrounds came together
                  with a singular goal: to make augmented reality accessible,
                  practical, and transformative.
                </p>
                <p className="text-gray-300">
                  Through countless hours of research, prototyping, and
                  iteration, we've created Eyeconic - AR glasses that don't just
                  display information, but intelligently integrate it into your
                  world in meaningful ways.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-8">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-4xl font-bold text-blue-400 mb-2">
                        500+
                      </div>
                      <div className="text-gray-300 text-sm">
                        Hours of Development
                      </div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-cyan-400 mb-2">
                        25+
                      </div>
                      <div className="text-gray-300 text-sm">Iterations</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-blue-400 mb-2">
                        13
                      </div>
                      <div className="text-gray-300 text-sm">Minds</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-cyan-400 mb-2">
                        1
                      </div>
                      <div className="text-gray-300 text-sm">Shared Vision</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              13 brilliant minds working together to shape the future of AR
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => handleMemberClick(member)}
                className="group bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer relative"
              >
                <div className="relative h-64 overflow-hidden">
                  {member.image &&
                  member.image !== "" &&
                  member.image !== "user-icon" ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                </div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <h3 className="text-white font-semibold mb-1 text-sm">
                    {member.name}
                  </h3>
                  <p className="text-gray-300 text-xs">{member.role}</p>
                  
                  {/* Social icons */}
                  <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-300">👤</span>
                    </div>
                    <div className="w-6 h-6 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-300">💼</span>
                    </div>
                  </div>
                  
                  {/* Profile arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-blue-600 rounded-full p-1.5">
                      <ArrowRight className="h-2.5 w-2.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Member Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <DownloadSection />
      <Footer />
      <ChatBot/>
    </div>
  );
};

export default AboutUs;
