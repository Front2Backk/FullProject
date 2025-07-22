import React, { useState, useRef, useEffect } from 'react';
import { Send, History, Trash2, Plus, Minimize2, MessageCircle, ArrowLeft, Mic, MicOff, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import MessageFormatter from '../components/FormattedMessage';

const ChatPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    currentSession,
    chatHistory,
    isLoading,
    isHistoryLoading,
    error,
    sendMessage,
    sendMessageWithImage,
    transcribeAudio,
    createNewSession,
    loadSession,
    deleteSession,
    openWidget,
    loadChatHistory,
    clearError
  } = useChat();

  const [message, setMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug logs
  useEffect(() => {
    console.log('Chat History:', chatHistory);
    console.log('Current Session:', currentSession);
    console.log('Loading States:', {
      auth: authLoading,
      chat: isLoading,
      history: isHistoryLoading
    });
  }, [chatHistory, currentSession, authLoading, isLoading, isHistoryLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, authLoading, isAuthenticated, navigate, clearError]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

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
          setMessage(prev => prev ? `${prev} ${transcription}` : transcription);
        } catch (error) {
          console.error('Error transcribing audio:', error);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 30000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !selectedImage) || isLoading) return;

    const messageText = message;
    setMessage('');
    
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

  const handleMinimize = () => {
    openWidget();
    navigate('/');
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
    setShowAttachmentMenu(false);
  };

  const renderHistoryItems = () => {
    if (isHistoryLoading) {
      return (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (chatHistory.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No chat history yet</p>
          <p className="text-sm mt-2">Start a conversation to see your chats here</p>
        </div>
      );
    }

    return chatHistory.map((session) => (
      <div
        key={session.id}
        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 group ${
          currentSession?.id === session.id
            ? 'bg-blue-600/20 border border-blue-400/30'
            : 'bg-gray-700/30 hover:bg-gray-700/50'
        }`}
        onClick={() => {
          loadSession(session.id);
          setShowHistory(false);
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate mb-1">
              {session.title}
            </p>
            <p className="text-gray-400 text-sm">
              {session.messages.length} messages
            </p>
            <p className="text-gray-500 text-xs">
              {session.createdAt.toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSession(session.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-600/20 transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>
    ));
  };

  if (authLoading || (isAuthenticated && isHistoryLoading)) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
        {/* Mobile History Overlay */}
        {showHistory && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowHistory(false)} />
            <div className="absolute top-16 left-0 right-0 bottom-0 bg-gray-800/95 backdrop-blur-md">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Chat History</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-4">
                  <button
                    onClick={() => {
                      createNewSession();
                      setShowHistory(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Chat</span>
                  </button>
                </div>
                
                <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto">
                  {renderHistoryItems()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Chat History Sidebar */}
        <div className={`hidden md:block ${showHistory ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-700 bg-gray-800/50`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Chat History</h3>
              <button
                onClick={createNewSession}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </button>
            </div>
            
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {renderHistoryItems()}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-800/50 backdrop-blur-md">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-300"
                  title="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-300" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-2xl font-bold text-white">Eyeconic AI</h1>
                    <p className="text-sm text-gray-400 hidden md:block">Your intelligent AR companion</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-3">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2 md:p-3 rounded-lg transition-all duration-300 ${
                    showHistory 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30' 
                      : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                  }`}
                >
                  <History className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                
                <button
                  onClick={handleMinimize}
                  className="p-2 md:p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 transition-colors duration-300"
                  title="Minimize to widget"
                >
                  <Minimize2 className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {currentSession?.messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8 md:mt-16">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <MessageCircle className="h-8 w-8 md:h-12 md:w-12 text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 md:mb-4">Welcome to Eyeconic AI</h3>
                <p className="text-base md:text-lg mb-2">Your intelligent assistant for all things AR</p>
                <p className="text-sm">Ask me about Eyeconic features, AR technology, or anything else!</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8 max-w-2xl mx-auto">
                  <button
                    onClick={() => setMessage("Tell me about Eyeconic AR glasses features")}
                    className="p-3 md:p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-left transition-all duration-300 border border-gray-600 hover:border-blue-400/50"
                  >
                    <h4 className="text-white font-medium mb-1 md:mb-2 text-sm md:text-base">🥽 Product Features</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Learn about our AR glasses capabilities</p>
                  </button>
                  
                  <button
                    onClick={() => setMessage("How do I get started with Eyeconic?")}
                    className="p-3 md:p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-left transition-all duration-300 border border-gray-600 hover:border-blue-400/50"
                  >
                    <h4 className="text-white font-medium mb-1 md:mb-2 text-sm md:text-base">🚀 Getting Started</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Quick setup and first steps</p>
                  </button>
                  
                  <button
                    onClick={() => setMessage("What makes Eyeconic different from other AR glasses?")}
                    className="p-3 md:p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-left transition-all duration-300 border border-gray-600 hover:border-blue-400/50"
                  >
                    <h4 className="text-white font-medium mb-1 md:mb-2 text-sm md:text-base">⚡ Why Eyeconic?</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Discover our unique advantages</p>
                  </button>
                  
                  <button
                    onClick={() => setMessage("Can you help me with technical support?")}
                    className="p-3 md:p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-left transition-all duration-300 border border-gray-600 hover:border-blue-400/50"
                  >
                    <h4 className="text-white font-medium mb-1 md:mb-2 text-sm md:text-base">🛠️ Technical Support</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Get help with any issues</p>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 md:space-y-6">
              {currentSession?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 md:space-x-3 max-w-[85%] md:max-w-[80%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                        : 'bg-gray-700'
                    }`}>
                      {msg.isUser ? (
                        <span className="text-white text-xs md:text-sm font-semibold">U</span>
                      ) : (
                        <MessageCircle className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
                      )}
                    </div>
                    
                    <div
                      className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-sm md:text-base ${
                        msg.isUser
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                          : 'bg-gray-700/50 text-gray-100 border border-gray-600'
                      }`}
                    >
                      {msg.image && (
                        <div className="mb-2">
                          <img
                            src={msg.image}
                            alt="Uploaded image"
                            className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                          />
                        </div>
                      )}
                      
                      {msg.isUser ? (
                        <p className="leading-relaxed">{msg.text}</p>
                      ) : (
                        <MessageFormatter text={msg.text} className="leading-relaxed" />
                      )}
                      
                      <p className={`text-xs mt-1 md:mt-2 ${msg.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageCircle className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
                    </div>
                    <div className="bg-gray-700/50 border border-gray-600 p-3 md:p-4 rounded-xl md:rounded-2xl">
                      <div className="flex space-x-1 md:space-x-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
            <div className="px-4 md:px-6 pb-2">
              <div className="flex items-center space-x-2 bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Selected image"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Image Selected</p>
                  <p className="text-gray-400 text-xs">{selectedImage?.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 md:p-6 border-t border-gray-700">
            {error && (
              <div className="mb-3 p-3 bg-red-600/20 text-red-400 rounded-lg text-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={clearError} className="p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex space-x-2 md:space-x-4">
              {/* Attachment Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleAttachmentClick}
                  className={`p-3 md:p-4 rounded-lg md:rounded-xl transition-all duration-300 ${
                    showAttachmentMenu 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30' 
                      : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600'
                  }`}
                >
                  <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
                </button>

                {/* Attachment Menu */}
                {showAttachmentMenu && (
                  <div className="absolute bottom-full left-0 mb-2 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg p-2 min-w-[120px] z-10">
                    <button
                      type="button"
                      onClick={handleImageUploadClick}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors text-sm"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span>Image</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Recording Button */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-600/20 text-red-400 border border-red-400/30 animate-pulse' 
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600'
                }`}
                disabled={isLoading}
                title={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Mic className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isRecording ? "Recording..." : "Type your message here..."}
                className="flex-1 px-3 py-3 md:px-6 md:py-4 bg-gray-700/50 border border-gray-600 rounded-lg md:rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 text-sm md:text-base"
                disabled={isLoading || isRecording}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!message.trim() && !selectedImage) || isLoading || isRecording}
                className="px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                title="Send message"
              >
                <Send className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </form>

            {/* Recording Status */}
            {isRecording && (
              <div className="mt-2 flex items-center justify-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording... Click mic to stop</span>
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
      </div>
    </div>
  );
};

export default ChatPage;