
import React from 'react';
import ChatBot from '@/components/Chat/ChatBot';
import { animations } from '@/lib/animations';

const ChatPage = () => {
  return (
    <div className={`min-h-full w-full ${animations.pageEnter}`}>
      <ChatBot />
    </div>
  );
};

export default ChatPage;
