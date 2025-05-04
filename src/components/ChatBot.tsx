
import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, X, MinusCircle, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Generate a simple response based on user input
  const generateResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return 'Hello! How can I help you today?';
    }
    
    if (lowerCaseMessage.includes('help')) {
      return 'I can help you navigate the CRM, find information, or assist with common tasks. What do you need help with?';
    }
    
    if (lowerCaseMessage.includes('dashboard')) {
      return 'The dashboard shows an overview of your business metrics. You can view charts, statistics, and important information at a glance.';
    }
    
    if (lowerCaseMessage.includes('client') || lowerCaseMessage.includes('customer')) {
      return 'You can manage clients in the Clients section. You can add, edit, and view client details there.';
    }

    if (lowerCaseMessage.includes('task') || lowerCaseMessage.includes('todo')) {
      return 'Tasks can be managed in the Tasks section. You can create new tasks, assign them to team members, and track their progress.';
    }

    if (lowerCaseMessage.includes('project')) {
      return 'Projects are available in the Projects section. You can create, manage, and track the progress of your projects there.';
    }

    if (lowerCaseMessage.includes('lead')) {
      return 'Leads can be managed in the Leads section. You can track potential clients and their status in the sales pipeline.';
    }

    if (lowerCaseMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    return "I'm not sure I understand. Can you provide more details or ask a different question?";
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    
    // Generate bot response with a slight delay to feel more natural
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(message),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className={cn(
          "w-80 shadow-lg transition-all duration-300 transform",
          isMinimized ? "h-12" : "h-96"
        )}>
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
              </Avatar>
              <CardTitle className="text-sm">CRM Assistant</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMinimize}>
                {isMinimized ? <Maximize className="h-4 w-4" /> : <MinusCircle className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto flex-1" style={{ height: 'calc(100% - 112px)' }}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.sender === 'bot' && (
                        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "rounded-lg p-3 max-w-[80%]",
                          msg.sender === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="p-3 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSendMessage} disabled={!message.trim()}>
                    Send
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
      
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="rounded-full h-12 w-12 flex items-center justify-center bg-primary shadow-lg hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatBot;
