// api/auth.ts
import api from './api';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt?: Date;
}

// Helper function to parse backend dates
const parseDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) return dateString;
  return new Date(dateString);
};

// Helper to transform backend message format to frontend format
const transformMessage = (msg: any): ChatMessage => ({
  id: msg.id || msg._id,
  text: msg.text || msg.content || '',
  isUser: msg.is_user || msg.isUser || false,
  timestamp: parseDate(msg.timestamp || msg.created_at || new Date()),
  image: msg.image || msg.image_url || undefined
});

// Helper to transform backend session format to frontend format
const transformSession = (session: any): ChatSession => ({
  id: session.id || session._id,
  title: session.title || `Chat ${parseDate(session.createdAt).toLocaleDateString()}`,
  messages: (session.messages || []).map(transformMessage),
  createdAt: parseDate(session.createdAt || session.created_at),
  updatedAt: session.updatedAt ? parseDate(session.updatedAt) : undefined
});

export const sendChatMessage = async (prompt: string, sessionId?: string): Promise<string> => {
  try {
    const payload = sessionId ? { prompt, session_id: sessionId } : { prompt };
    const response = await api.post('/chat/', payload);
    return response.data.response || response.data.message || response.data.content || '';
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to send message. Please try again.');
  }
};

export const sendChatMessageWithImage = async (
  prompt: string, 
  imageFile: File, 
  sessionId?: string
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('image', imageFile);
    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    const response = await api.post('/chat/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.response || response.data.message || response.data.content || '';
  } catch (error: any) {
    console.error('Error sending chat message with image:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to send message with image. Please try again.');
  }
};

export const getChatHistory = async (): Promise<ChatSession[]> => {
  try {
    const response = await api.get('/chat-history/');
    const data = Array.isArray(response.data) 
      ? response.data 
      : response.data.results || [];
    
    return data.map(transformSession);
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized error (token expired)
      throw new Error('Session expired. Please login again.');
    }
    return [];
  }
};

export const getChatSession = async (sessionId: string): Promise<ChatSession> => {
  try {
    const response = await api.get(`/chat/${sessionId}/`);
    return transformSession(response.data);
  } catch (error: any) {
    console.error('Error fetching chat session:', error);
    if (error.response?.status === 404) {
      throw new Error('Chat session not found');
    }
    throw new Error('Failed to load chat session. Please try again.');
  }
};

export const createNewChatSession = async (): Promise<ChatSession> => {
  try {
    const response = await api.post('/chat/new/');
    return transformSession(response.data);
  } catch (error: any) {
    console.error('Error creating new chat session:', error);
    throw new Error('Failed to create new chat session. Please try again.');
  }
};

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  try {
    await api.delete(`/chat/${sessionId}/`);
  } catch (error: any) {
    console.error('Error deleting chat session:', error);
    if (error.response?.status === 404) {
      return; // Session already deleted
    }
    throw new Error('Failed to delete chat session. Please try again.');
  }
};

export const updateChatTitle = async (sessionId: string, title: string): Promise<void> => {
  try {
    await api.patch(`/chat/${sessionId}/`, { title });
  } catch (error: any) {
    console.error('Error updating chat title:', error);
    throw new Error('Failed to update chat title. Please try again.');
  }
};

export const transcribeAudio = async (audioFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await api.post('/transcribe-audio/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.transcription || response.data.text || '';
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

// Authentication functions
export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export const loginRequest = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/users/login/', { username, password });
    
    if (!response.data.access || !response.data.refresh) {
      throw new Error('Invalid server response');
    }

    // If user data is included in login response
    if (response.data.user) {
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user
      };
    }
    
    // If not, fetch user profile separately
    const userResponse = await api.get('/users/profile/');
    return {
      access: response.data.access,
      refresh: response.data.refresh,
      user: userResponse.data
    };
  } catch (error: any) {
    console.error('Login request failed:', error);
    let errorMessage = 'Login failed. Please try again.';
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.non_field_errors) {
      errorMessage = error.response.data.non_field_errors[0];
    }
    throw new Error(errorMessage);
  }
};

export const registerRequest = async (
  username: string,
  email: string,
  password: string,
  firstName: string = '',
  lastName: string = ''
): Promise<AuthResponse> => {
  try {
    const response = await api.post('/users/register/', {
      username,
      email,
      password1: password,
      password2: password,
      first_name: firstName,
      last_name: lastName
    });
    
    if (!response.data.access || !response.data.refresh) {
      throw new Error('Registration succeeded but login failed');
    }

    return {
      access: response.data.access,
      refresh: response.data.refresh,
      user: {
        id: response.data.user?.id || '',
        username: response.data.user?.username || username,
        email: response.data.user?.email || email,
        first_name: response.data.user?.first_name || firstName,
        last_name: response.data.user?.last_name || lastName
      }
    };
  } catch (error: any) {
    console.error('Register request failed:', error);
    let errorMessage = 'Registration failed. Please try again.';
    if (error.response?.data?.username) {
      errorMessage = `Username: ${error.response.data.username[0]}`;
    } else if (error.response?.data?.email) {
      errorMessage = `Email: ${error.response.data.email[0]}`;
    } else if (error.response?.data?.password1) {
      errorMessage = `Password: ${error.response.data.password1[0]}`;
    }
    throw new Error(errorMessage);
  }
};

export const logoutRequest = async (): Promise<void> => {
  try {
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      await api.post('/users/logout/', { refresh });
    }
  } catch (error) {
    console.error('Logout request failed:', error);
    // Even if logout fails, we should clear local storage
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const getUserProfile = async (): Promise<AuthResponse['user']> => {
  try {
    const response = await api.get('/users/profile/');
    return response.data;
  } catch (error: any) {
    console.error('Get user profile failed:', error);
    if (error.response?.status === 401) {
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to load user profile. Please try again.');
  }
};

export const refreshAccessToken = async (): Promise<{ access: string }> => {
  try {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      throw new Error('No refresh token available');
    }
    const response = await api.post('/users/token/refresh/', { refresh });
    return { access: response.data.access };
  } catch (error: any) {
    console.error('Refresh token failed:', error);
    throw new Error('Session expired. Please login again.');
  }
};