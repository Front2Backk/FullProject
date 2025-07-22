import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Maximize2, Mic, MicOff, Paperclip, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import MessageFormatter from "../components/FormattedMessage";

const ChatBot: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    currentSession,
    isWidgetOpen,
    isLoading,
    openWidget,
    closeWidget,
    sendMessage,
    sendMessageWithImage,
    transcribeAudio,
  } = useChat();

  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isWidgetOpen && currentSession?.messages.length > 0) {
      scrollToBottom();
    }
  }, [currentSession?.messages, isWidgetOpen]);

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        
        try {
          const transcription = await transcribeAudio(audioFile);
          setMessage(transcription);
        } catch (error) {
          console.error('Error transcribing audio:', error);
          alert('Failed to transcribe audio. Please try again.');
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to use voice recording.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Image handling functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setShowAttachmentMenu(false);
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
    setShowAttachmentMenu(false);
  };

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      alert("Please sign in to use the chatbot feature.");
      return;
    }
    openWidget();
  };

  const handleMaximize = () => {
    navigate("/chat");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !selectedImage) || isLoading) return;

    const messageText = message;
    setMessage("");
    
    try {
      if (selectedImage) {
        await sendMessageWithImage(messageText, selectedImage);
        removeImage();
      } else {
        await sendMessage(messageText);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
        title="Sign in to use chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <>
      {/* Chat Widget Button */}
      {!isWidgetOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
          title="Open Chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Widget */}
      {isWidgetOpen && (
        <div className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] max-w-96 h-[600px] sm:bottom-6 sm:right-6 sm:w-96 bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl z-50 flex flex-col">
          {/* Widget Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Eyeconic AI</h3>
                <p className="text-gray-400 text-xs">Your AR assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleMaximize}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 transition-colors duration-300"
                title="Maximize to full page"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={closeWidget}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 transition-colors duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Widget Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {currentSession?.messages.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Hi! I'm your Eyeconic AI assistant.</p>
                <p className="text-xs mt-1">How can I help you today?</p>
                
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <button
                    onClick={() => setMessage("Tell me about Eyeconic AR glasses features")}
                    className="p-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-left transition-all duration-300 border border-gray-600 hover:border-blue-400/50"
                  >
                    <p className="text-white font-medium text-xs">🥽 Product Features</p>
                  </button>
                  
                  <button
                    onClick={() => setMessage("How do I get started with Eyeconic?")}
                    className="p-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-left transition-all duration-300 border border-gray-600 hover:border-blue-400/50"
                  >
                    <p className="text-white font-medium text-xs">🚀 Getting Started</p>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {currentSession?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[85%] ${
                      msg.isUser ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.isUser
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                          : "bg-gray-700"
                      }`}
                    >
                      {msg.isUser ? (
                        <span className="text-white text-xs font-semibold">
                          U
                        </span>
                      ) : (
                        <MessageCircle className="h-3 w-3 text-blue-400" />
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl text-sm ${
                        msg.isUser
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                          : "bg-gray-700/50 text-gray-100 border border-gray-600"
                      }`}
                    >
                      {msg.image && (
                        <div className="mb-2">
                          <img
                            src={msg.image}
                            alt="Uploaded image"
                            className="max-w-full h-auto rounded-lg max-h-32 object-cover"
                          />
                        </div>
                      )}

                      {/* Use MessageFormatter for bot messages, regular text for user messages */}
                      {msg.isUser ? (
                        <p className="leading-relaxed">{msg.text}</p>
                      ) : (
                        <MessageFormatter text={msg.text} className="leading-relaxed" />
                      )}

                      <p
                        className={`text-xs mt-1 ${
                          msg.isUser ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageCircle className="h-3 w-3 text-blue-400" />
                    </div>
                    <div className="bg-gray-700/50 border border-gray-600 p-3 rounded-xl">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="px-4 pb-2">
              <div className="flex items-center space-x-2 bg-gray-700/50 p-2 rounded-lg border border-gray-600">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Selected image"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                                    <button
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-2 w-2 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-medium">Image Selected</p>
                  <p className="text-gray-400 text-xs">{selectedImage?.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Widget Input */}
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              {/* Attachment Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleAttachmentClick}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    showAttachmentMenu 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30' 
                      : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600'
                  }`}
                  title="Attach image"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                {/* Attachment Menu */}
                {showAttachmentMenu && (
                  <div className="absolute bottom-full left-0 mb-2 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg p-2 min-w-[100px] z-10">
                    <button
                      type="button"
                      onClick={handleImageUploadClick}
                      className="w-full flex items-center space-x-2 px-2 py-1 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors text-xs"
                    >
                      <ImageIcon className="h-3 w-3" />
                      <span>Image</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Recording Button */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-600/20 text-red-400 border border-red-400/30 animate-pulse' 
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600'
                }`}
                disabled={isLoading}
                title={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isRecording ? "Recording..." : "Type your message..."}
                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all duration-300"
                disabled={isLoading || isRecording}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!message.trim() && !selectedImage) || isLoading || isRecording}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Recording Status */}
            {isRecording && (
              <div className="mt-2 flex items-center justify-center space-x-2 text-red-400">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Recording... Click mic to stop</span>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
      )}
    </>
  );
};

export default ChatBot;