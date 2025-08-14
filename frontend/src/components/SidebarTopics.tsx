import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Avatar, Input, List } from 'antd';
import { Topic } from '@/types/chat';

export default function SidebarTopics({ onSelect }: { onSelect?: (topic: Topic) => void }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    axios.get<Topic[]>(`${process.env.NEXT_PUBLIC_API_URL}/topic`).then(res => setTopics(res.data)).catch(console.error);
  }, []);

  const filtered = topics.filter(t => t.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 12, background: '#fafafa', fontWeight: 600 }}>Group Chat</div>
      <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Search chats" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        <List itemLayout="horizontal" dataSource={filtered} renderItem={t => (
          <List.Item>
            <List.Item.Meta avatar={<Avatar src={t.avatar}>{t.title?.[0]}</Avatar>} title={<Link href={`/chat/${t._id}`}>{t.title}</Link>} description={t.lastMessage ?? 'No messages yet'} />
          </List.Item>
        )} />
      </div>
    </div>
  );
}