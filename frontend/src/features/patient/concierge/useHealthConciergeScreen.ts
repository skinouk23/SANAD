import { useState } from 'react';

import { formatTime } from '@/shared/lib/i18n/formatting';

import {
  initialMessages,
  type ConciergeMessage,
  type HealthConciergeTab,
} from './healthConcierge.data';

function createTimestamp(): string {
  return formatTime(new Date(), {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function useHealthConciergeScreen() {
  const [activeTab, setActiveTab] = useState<HealthConciergeTab>('chat');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<ConciergeMessage[]>(initialMessages);

  const handleSendMessage = () => {
    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage) {
      return;
    }

    const messageTimestamp = createTimestamp();

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        sender: 'user',
        text: trimmedMessage,
        time: messageTimestamp,
      },
    ]);
    setMessageInput('');

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          sender: 'concierge',
          name: 'Amira',
          text: "Je m'occupe de votre demande immédiatement. Je reviens vers vous dans quelques instants.",
          time: createTimestamp(),
          avatar: '👩‍⚕️',
        },
      ]);
    }, 1500);
  };

  return {
    activeTab,
    handleSendMessage,
    messageInput,
    messages,
    setActiveTab,
    setMessageInput,
  };
}
