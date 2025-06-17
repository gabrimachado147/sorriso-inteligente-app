
import React from 'react';
import ChatBot from '@/components/Chat/ChatBot';
import { animations } from '@/lib/animations';

const ChatPage = () => {
  return (
    <div className={`min-h-full w-full ${animations.pageEnter}`}>
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold">Chat Inteligente</h1>
        <p className="text-muted-foreground mt-2">
          Converse com nosso assistente virtual
        </p>
      </div>
      <ChatBot />
    </div>
  );
};

export default ChatPage;
