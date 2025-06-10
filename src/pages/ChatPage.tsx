
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ChatBot from '@/components/Chat/ChatBot';

const ChatPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Chat com Assistente</h1>
        </div>
      </div>

      {/* Chat Container */}
      <div className="p-4 h-[calc(100vh-80px)]">
        <ChatBot />
      </div>
    </div>
  );
};

export default ChatPage;
