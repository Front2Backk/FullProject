import React, { createContext, useContext, useState, useEffect } from "react";
import {
  sendChatMessage,
  sendChatMessageWithImage,
  getChatHistory,
  deleteChatSession,
  transcribeAudio as transcribeAudioAPI,
} from "../api/auth";
import { useAuth } from "./AuthContext";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt?: Date;
}

interface ChatContextType {
  currentSession: ChatSession | null;
  chatHistory: ChatSession[];
  isOpen: boolean;
  isWidgetOpen: boolean;
  isLoading: boolean;
  isHistoryLoading: boolean;
  error: string | null;
  openChat: () => void;
  closeChat: () => void;
  openWidget: () => void;
  closeWidget: () => void;
  sendMessage: (message: string) => Promise<void>;
  sendMessageWithImage: (message: string, image: File) => Promise<void>;
  transcribeAudio: (audioFile: File) => Promise<string>;
  createNewSession: () => Promise<void>;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => Promise<void>;
  loadChatHistory: () => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const clearError = () => setError(null);

  // Initialize chat when authentication changes
  useEffect(() => {
    const initializeChat = async () => {
      if (!isAuthenticated) return;

      try {
        setIsHistoryLoading(true);
        const history = await loadChatHistory();
        
        if (!currentSession) {
          if (history.length > 0) {
            setCurrentSession(history[0]);
          } else {
            await createNewSession();
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize chat");
      } finally {
        setIsHistoryLoading(false);
      }
    };

    initializeChat();
  }, [isAuthenticated]);

  const openChat = () => {
    setIsOpen(true);
    setIsWidgetOpen(false);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const openWidget = () => {
    setIsWidgetOpen(true);
    setIsOpen(false);
  };

  const closeWidget = () => {
    setIsWidgetOpen(false);
  };

  const createNewSession = async () => {
    try {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
      };
      setCurrentSession(newSession);
      setChatHistory(prev => [newSession, ...prev]);
    } catch (err) {
      console.error("Error creating new session:", err);
      setError("Failed to create new chat session");
      throw err;
    }
  };

  const loadChatHistory = async () => {
    if (!isAuthenticated) return [];
    
    setIsHistoryLoading(true);
    setError(null);
    
    try {
      const history = await getChatHistory();
      
      const transformedHistory = history.map(session => ({
        id: session.id?.toString() || Date.now().toString(),
        title: session.title || `Chat ${new Date(session.createdAt).toLocaleString()}`,
        messages: (session.messages || []).map(msg => ({
          id: msg.id?.toString() || Date.now().toString(),
          text: msg.text || msg.content || "",
          isUser: Boolean(msg.isUser || msg.role === "user"),
          timestamp: new Date(msg.timestamp || msg.created_at || Date.now()),
          image: msg.image || undefined
        })),
        createdAt: new Date(session.createdAt || Date.now()),
        updatedAt: session.updatedAt ? new Date(session.updatedAt) : undefined
      }));

      setChatHistory(transformedHistory);
      return transformedHistory;
    } catch (err) {
      console.error("Error loading chat history:", err);
      setError("Failed to load chat history");
      setChatHistory([]);
      return [];
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!currentSession || !message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      };

      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        title: currentSession.messages.length === 0 
          ? message.slice(0, 30) + (message.length > 30 ? "..." : "")
          : currentSession.title,
      };

      setCurrentSession(updatedSession);

      const botResponse = await sendChatMessage(message);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, botMessage],
      };

      setCurrentSession(finalSession);
      updateHistory(finalSession);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageWithImage = async (message: string, image: File) => {
    if (!currentSession) return;

    setIsLoading(true);
    setError(null);
    let imageUrl = "";

    try {
      imageUrl = URL.createObjectURL(image);

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
        image: imageUrl,
      };

      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        title: currentSession.messages.length === 0
          ? (message || "Image").slice(0, 30) + "..."
          : currentSession.title,
      };

      setCurrentSession(updatedSession);

      const botResponse = await sendChatMessageWithImage(message, image);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, botMessage],
      };

      setCurrentSession(finalSession);
      updateHistory(finalSession);
    } catch (err) {
      console.error("Error sending image message:", err);
      setError("Failed to send message with image");
      throw err;
    } finally {
      setIsLoading(false);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    }
  };

  const updateHistory = (session: ChatSession) => {
    setChatHistory(prev => {
      const existingIndex = prev.findIndex(s => s.id === session.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = session;
        return updated;
      }
      return [session, ...prev];
    });
  };

  const transcribeAudio = async (audioFile: File): Promise<string> => {
    try {
      setIsLoading(true);
      const transcription = await transcribeAudioAPI(audioFile);
      return transcription;
    } catch (err) {
      console.error("Error transcribing audio:", err);
      setError("Failed to transcribe audio");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = (sessionId: string) => {
    const session = chatHistory.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      await deleteChatSession(sessionId);
      
      setChatHistory(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        if (chatHistory.length > 1) {
          const otherSession = chatHistory.find(s => s.id !== sessionId);
          if (otherSession) {
            setCurrentSession(otherSession);
          } else {
            await createNewSession();
          }
        } else {
          await createNewSession();
        }
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Failed to delete chat session");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      chatHistory.forEach(session => {
        session.messages.forEach(message => {
          if (message.image && message.image.startsWith("blob:")) {
            URL.revokeObjectURL(message.image);
          }
        });
      });
    };
  }, [chatHistory]);

  return (
    <ChatContext.Provider
      value={{
        currentSession,
        chatHistory,
        isOpen,
        isWidgetOpen,
        isLoading,
        isHistoryLoading,
        error,
        openChat,
        closeChat,
        openWidget,
        closeWidget,
        sendMessage,
        sendMessageWithImage,
        transcribeAudio,
        createNewSession,
        loadSession,
        deleteSession,
        loadChatHistory,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;








