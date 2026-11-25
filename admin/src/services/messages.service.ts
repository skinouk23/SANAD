/**
 * Messages Service
 * Handles all messaging and conversation-related API calls
 */

import { api } from '../api/client';
import { env } from '../config/env';
import { generatePatients, generateProviders } from '../data/mock/generators';
import type {
  Conversation,
  Message,
  User,
  PaginatedResponse,
  PaginationParams } from
'../types/api.types';

// ============================================
// MOCK DATA
// ============================================

const randomId = () => Math.random().toString(36).substring(2, 15);
const randomDate = (daysAgo: number = 7) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

let mockConversations: Conversation[] | null = null;
let mockMessages: Map<string, Message[]> = new Map();

function getMockConversations(): Conversation[] {
  if (!mockConversations) {
    const patients = generatePatients(5);
    const providers = generateProviders(5);

    mockConversations = patients.map((patient, i) => {
      const provider = providers[i % providers.length];
      const convId = `conv_${randomId()}`;

      // Generate messages for this conversation
      const messages: Message[] = [
      {
        id: `msg_${randomId()}`,
        conversationId: convId,
        senderId: patient.id,
        content:
        'Bonjour, je souhaite prendre rendez-vous pour une consultation.',
        type: 'text',
        read: true,
        createdAt: randomDate(5)
      },
      {
        id: `msg_${randomId()}`,
        conversationId: convId,
        senderId: provider.id,
        content: 'Bonjour ! Bien sûr, quand êtes-vous disponible ?',
        type: 'text',
        read: true,
        createdAt: randomDate(4)
      },
      {
        id: `msg_${randomId()}`,
        conversationId: convId,
        senderId: patient.id,
        content: 'Demain matin serait parfait si possible.',
        type: 'text',
        read: Math.random() > 0.5,
        createdAt: randomDate(2)
      }];


      mockMessages.set(convId, messages);

      return {
        id: convId,
        participants: [
        {
          userId: patient.id,
          user: patient as User,
          role: 'patient' as const,
          joinedAt: randomDate(30)
        },
        {
          userId: provider.id,
          user: provider as User,
          role: 'provider' as const,
          joinedAt: randomDate(30)
        }],

        lastMessage: messages[messages.length - 1],
        unreadCount: messages.filter((m) => !m.read).length,
        createdAt: randomDate(30),
        updatedAt: randomDate(1)
      };
    });
  }
  return mockConversations;
}

// ============================================
// CONVERSATION ENDPOINTS
// ============================================

export interface ConversationFilters extends PaginationParams {
  userId?: string;
  unreadOnly?: boolean;
}

export async function getConversations(
filters?: ConversationFilters)
: Promise<Conversation[]> {
  if (env.ENABLE_MOCK_DATA) {
    let conversations = getMockConversations();

    if (filters?.unreadOnly) {
      conversations = conversations.filter((c) => c.unreadCount > 0);
    }

    // Sort by last update
    conversations.sort(
      (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return conversations;
  }

  try {
    return await api.get<Conversation[]>('/conversations', { params: filters });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockConversations();
  }
}

export async function getConversationById(
conversationId: string)
: Promise<Conversation | null> {
  if (env.ENABLE_MOCK_DATA) {
    return getMockConversations().find((c) => c.id === conversationId) || null;
  }

  try {
    return await api.get<Conversation>(`/conversations/${conversationId}`);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockConversations().find((c) => c.id === conversationId) || null;
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  if (env.ENABLE_MOCK_DATA) {
    const conversations = getMockConversations();
    return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }

  try {
    const result = await api.get<{count: number;}>(
      `/conversations/unread-count`
    );
    return result.count;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockConversations().reduce((sum, c) => sum + c.unreadCount, 0);
  }
}

// ============================================
// MESSAGE ENDPOINTS
// ============================================

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (env.ENABLE_MOCK_DATA) {
    return mockMessages.get(conversationId) || [];
  }

  try {
    return await api.get<Message[]>(`/conversations/${conversationId}/messages`);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return mockMessages.get(conversationId) || [];
  }
}

export async function sendMessage(
conversationId: string,
content: string,
senderId: string)
: Promise<Message | null> {
  const newMessage: Message = {
    id: `msg_${randomId()}`,
    conversationId,
    senderId,
    content,
    type: 'text',
    read: false,
    createdAt: new Date().toISOString()
  };

  if (env.ENABLE_MOCK_DATA) {
    const messages = mockMessages.get(conversationId) || [];
    messages.push(newMessage);
    mockMessages.set(conversationId, messages);

    // Update conversation
    const conversations = getMockConversations();
    const convIndex = conversations.findIndex((c) => c.id === conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = newMessage;
      conversations[convIndex].updatedAt = newMessage.createdAt;
    }

    return newMessage;
  }

  try {
    return await api.post<Message>(
      `/conversations/${conversationId}/messages`,
      { content }
    );
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function markAsRead(conversationId: string): Promise<boolean> {
  if (env.ENABLE_MOCK_DATA) {
    const messages = mockMessages.get(conversationId);
    if (messages) {
      messages.forEach((m) => {
        m.read = true;
        m.readAt = new Date().toISOString();
      });
    }

    const conversations = getMockConversations();
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.unreadCount = 0;
    }

    return true;
  }

  try {
    await api.post(`/conversations/${conversationId}/read`);
    return true;
  } catch (error) {
    console.warn('API call failed:', error);
    return false;
  }
}

export async function createConversation(
participantIds: string[])
: Promise<Conversation | null> {
  if (env.ENABLE_MOCK_DATA) {
    const newConv: Conversation = {
      id: `conv_${randomId()}`,
      participants: participantIds.map((id) => ({
        userId: id,
        role: 'patient' as const,
        joinedAt: new Date().toISOString()
      })),
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    getMockConversations().push(newConv);
    mockMessages.set(newConv.id, []);
    return newConv;
  }

  try {
    return await api.post<Conversation>('/conversations', { participantIds });
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

// ============================================
// SERVICE EXPORT
// ============================================

export const messagesService = {
  getConversations,
  getConversationById,
  getUnreadCount,
  getMessages,
  sendMessage,
  markAsRead,
  createConversation
};

export default messagesService;