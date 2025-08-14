'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ChatLayout from '../layout';
import ChatRoom from '@/components/ChatRoom';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const topicId = params.topicId as string;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fromQuery = searchParams.get('userId');
    if (fromQuery) {
      sessionStorage.setItem('userId', fromQuery);
      setUserId(fromQuery);
    } else {
      const stored = sessionStorage.getItem('userId');
      setUserId(stored);
    }
  }, [searchParams]);

  if (!userId) return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Missing userId</div>;

  return (
    <ChatRoom topicId={topicId} userId={userId} />
  );
}