
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, SendHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>('contact-1');
  const [messageInput, setMessageInput] = useState('');
  
  // Sample contacts data
  const contacts: Contact[] = [
    {
      id: 'contact-1',
      name: 'John Manager',
      avatar: '',
      lastMessage: 'Can you send me the report by tomorrow?',
      lastMessageTime: '10:30 AM',
      unread: 2,
      isOnline: true
    },
    {
      id: 'contact-2',
      name: 'Jane Employee',
      avatar: '',
      lastMessage: 'I\'ve finished the project tasks.',
      lastMessageTime: 'Yesterday',
      unread: 0,
      isOnline: true
    },
    {
      id: 'contact-3',
      name: 'Sam Intern',
      avatar: '',
      lastMessage: 'Thanks for your help!',
      lastMessageTime: 'Yesterday',
      unread: 0,
      isOnline: false
    },
    {
      id: 'contact-4',
      name: 'Anna Client',
      avatar: '',
      lastMessage: 'When can we schedule a meeting?',
      lastMessageTime: 'Monday',
      unread: 1,
      isOnline: false
    },
    {
      id: 'contact-5',
      name: 'System Administrator',
      avatar: '',
      lastMessage: 'Your account has been updated.',
      lastMessageTime: 'Last week',
      unread: 0,
      isOnline: true
    }
  ];

  // Sample messages data for the selected contact
  const messagesByContact: Record<string, Message[]> = {
    'contact-1': [
      {
        id: 'm1',
        senderId: 'current-user',
        text: 'Hi John, how are you today?',
        timestamp: '10:15 AM',
        read: true
      },
      {
        id: 'm2',
        senderId: 'contact-1',
        text: 'I\'m good, thanks! How about you?',
        timestamp: '10:17 AM',
        read: true
      },
      {
        id: 'm3',
        senderId: 'current-user',
        text: 'Doing well! Just working on the quarterly report.',
        timestamp: '10:20 AM',
        read: true
      },
      {
        id: 'm4',
        senderId: 'contact-1',
        text: 'Great! That\'s actually what I wanted to talk to you about.',
        timestamp: '10:22 AM',
        read: true
      },
      {
        id: 'm5',
        senderId: 'contact-1',
        text: 'Can you send me the report by tomorrow?',
        timestamp: '10:30 AM',
        read: false
      },
      {
        id: 'm6',
        senderId: 'contact-1',
        text: 'We need to review it before the client meeting.',
        timestamp: '10:30 AM',
        read: false
      }
    ],
    'contact-2': [
      {
        id: 'm1',
        senderId: 'contact-2',
        text: 'Hello, I\'ve been working on the project tasks you assigned.',
        timestamp: 'Yesterday 4:30 PM',
        read: true
      },
      {
        id: 'm2',
        senderId: 'current-user',
        text: 'Hi Jane! That\'s great to hear. How\'s the progress?',
        timestamp: 'Yesterday 4:45 PM',
        read: true
      },
      {
        id: 'm3',
        senderId: 'contact-2',
        text: 'I\'ve finished all the tasks. Should I start on the next phase?',
        timestamp: 'Yesterday 5:00 PM',
        read: true
      }
    ],
    'contact-3': [
      {
        id: 'm1',
        senderId: 'current-user',
        text: 'Hey Sam, how\'s the internship going?',
        timestamp: 'Yesterday 1:15 PM',
        read: true
      },
      {
        id: 'm2',
        senderId: 'contact-3',
        text: 'It\'s going well! I\'m learning a lot.',
        timestamp: 'Yesterday 1:30 PM',
        read: true
      },
      {
        id: 'm3',
        senderId: 'current-user',
        text: 'Glad to hear that! Let me know if you need any help.',
        timestamp: 'Yesterday 1:45 PM',
        read: true
      },
      {
        id: 'm4',
        senderId: 'contact-3',
        text: 'Thanks for your help!',
        timestamp: 'Yesterday 2:00 PM',
        read: true
      }
    ],
    'contact-4': [
      {
        id: 'm1',
        senderId: 'contact-4',
        text: 'Hello, I\'d like to discuss the progress on our project.',
        timestamp: 'Monday 11:00 AM',
        read: true
      },
      {
        id: 'm2',
        senderId: 'current-user',
        text: 'Hi Anna! Sure, we\'re making good progress. Would you like to schedule a call?',
        timestamp: 'Monday 11:30 AM',
        read: true
      },
      {
        id: 'm3',
        senderId: 'contact-4',
        text: 'Yes, that would be great. When are you available?',
        timestamp: 'Monday 12:00 PM',
        read: true
      },
      {
        id: 'm4',
        senderId: 'contact-4',
        text: 'When can we schedule a meeting?',
        timestamp: 'Monday 3:45 PM',
        read: false
      }
    ],
    'contact-5': [
      {
        id: 'm1',
        senderId: 'contact-5',
        text: 'Hello, this is a system notification.',
        timestamp: 'Last week',
        read: true
      },
      {
        id: 'm2',
        senderId: 'contact-5',
        text: 'Your account has been updated with new permissions.',
        timestamp: 'Last week',
        read: true
      },
      {
        id: 'm3',
        senderId: 'current-user',
        text: 'Thanks for the update!',
        timestamp: 'Last week',
        read: true
      }
    ]
  };

  // Filter contacts based on search
  const filteredContacts = searchQuery
    ? contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  // Get messages for the selected contact
  const messages = selectedContact ? messagesByContact[selectedContact] || [] : [];

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    // In a real app, this would add the message to the backend
    // For now, we'll just log it
    console.log('Sending message to', selectedContact, ':', messageInput);
    
    // Clear the input
    setMessageInput('');
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Find selected contact details
  const selectedContactDetails = selectedContact
    ? contacts.find(c => c.id === selectedContact)
    : null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-240px)]">
          {/* Contacts List */}
          <Card className="h-full overflow-hidden flex flex-col">
            <CardHeader className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              <div className="flex flex-col">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedContact === contact.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{contact.name}</h3>
                        <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No contacts found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages Chat */}
          <Card className="h-full overflow-hidden flex flex-col">
            {selectedContact ? (
              <>
                <CardHeader className="border-b p-4 flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedContactDetails ? getInitials(selectedContactDetails.name) : ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle>{selectedContactDetails?.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {selectedContactDetails?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-y-auto flex flex-col-reverse">
                  <div className="flex flex-col p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === 'current-user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === 'current-user'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="border-t p-4 flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">Select a contact to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
