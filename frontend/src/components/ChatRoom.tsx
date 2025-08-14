import { socket } from '@/lib/socket';
import { Message } from '@/types/chat';
import { Avatar, Button } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

export default function ChatRoom({ topicId, userId }: { topicId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ id: string; name?: string }[]>([]);
  const mountedRef = useRef(true);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    socket.connect();

    axios.get<Message[]>(`${process.env.NEXT_PUBLIC_API_URL}/message/${topicId}`).then(res => {
      if (!mountedRef.current) return;
      setMessages(res.data);
      scrollToBottom();
    }).catch(console.error);

    socket.emit('join_topic', { topicId, userId });

    const onNewMessage = (msg: Message) => {
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
    };

    const onUserTyping = (payload: { id: string; name?: string }) => {
      setTypingUsers(prev => (prev.find(u => u.id === payload.id) ? prev : [...prev, payload]));
    };

    const onUserStopTyping = (payload: { id: string }) => {
      setTypingUsers(prev => prev.filter(u => u.id !== payload.id));
    };

    socket.on('new_message', onNewMessage);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stop_typing', onUserStopTyping);

    return () => {
      mountedRef.current = false;
      socket.off('new_message', onNewMessage);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stop_typing', onUserStopTyping);
      socket.emit('leave_topic', { topicId, userId });
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, userId]);

  const send = (content: { text?: string; media?: any[] }) => {
    const tempId = `temp-${Date.now()}`;
    const optimistic: Message = {
      _id: tempId,
      topic_id: topicId,
      sender_id: userId,
      content,
      createdAt: new Date().toISOString(),
      read_by: [],
    };
    setMessages(prev => [...prev, optimistic]);
    scrollToBottom();

    socket.emit('send_message', { topic_id: topicId, sender_id: userId, content, timestamp: new Date().toISOString() }, (ack: any) => {
      if (ack?.success && ack.message) {
        setMessages(prev => prev.map(m => (m._id === tempId ? ack.message : m)));
      } else {
        setTimeout(() => {
          axios.get<Message[]>(`${process.env.NEXT_PUBLIC_API_URL}/message/${topicId}`).then(res => setMessages(res.data)).catch(console.error);
        }, 500);
      }
    });
  };

  const handleTyping = (name?: string) => {
    socket.emit('typing', { topicId, userId, name });
    setTimeout(() => socket.emit('stop_typing', { topicId, userId }), 2000);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (!listRef.current) return;
      listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  };

  console.log('messages body', messages);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 64, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: '#fff' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar />
          <div>
            <div style={{ fontWeight: 600 }}>Group Chat</div>
            <div style={{ fontSize: 12, color: '#777' }}>{typingUsers.length ? `${typingUsers.map(u => u.name ?? u.id).join(', ')} typing...` : 'Online'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="text">Call</Button>
          <Button type="text">Video</Button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }} ref={listRef}>
        {messages.map(m => (
          <MessageBubble key={m._id} message={m} currentUserId={userId} />
        ))}
        {typingUsers.length > 0 && <TypingIndicator userIds={typingUsers.map(u => u.id)} />}
      </div>

      <MessageInput topicId={topicId} userId={userId} onSend={send} onTyping={() => handleTyping()} />
    </div>
  );
}