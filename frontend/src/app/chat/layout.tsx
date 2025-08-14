'use client'
import type { Topic } from '@/types/chat';
import { MenuOutlined, MessageOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Input, Layout, Menu, Spin, Typography } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const { Sider, Content, Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const activeId = pathname?.split('/').pop() ?? '';
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get<Topic[]>(`${process.env.NEXT_PUBLIC_API_URL}/topic`)
      .then(res => setTopics(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = topics.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={300}
        theme="light"
        style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: 16, fontWeight: 600, fontSize: 18, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <MessageOutlined />
            Group Chat
          </div>
        </div>

        <div style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
          <Search placeholder="Search chats" onChange={e => setSearch(e.target.value)} value={search} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ marginTop: 50, display: 'block', textAlign: 'center' }}>
              <Spin />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>No chats found</div>
          ) : (
            <Menu mode="inline" selectedKeys={[activeId]} style={{ borderRight: 0 }}>
              {filtered.map(topic => (
                <Menu.Item key={topic._id} icon={<Avatar src={topic.avatar}>{topic.title?.[0]}</Avatar>}>
                  <Link href={`/chat/${topic._id}`}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: activeId === topic._id ? 600 : 400 }}>{topic.title}</span>
                      <Text type="secondary" ellipsis style={{ fontSize: 12 }}>{topic.lastMessage ?? 'No messages yet'}</Text>
                    </div>
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          )}
        </div>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="text" icon={<MenuOutlined />} className="md:hidden" onClick={() => setDrawerOpen(true)} />
            <MessageOutlined />
            <strong>{activeId ? `Chat: ${activeId}` : 'Select a chat'}</strong>
          </div>
        </Header>
        <Content style={{ display: 'flex', flexDirection: 'column' }}>{children}</Content>
      </Layout>

      {/* <Drawer title="Chats" placement="left" onClose={() => setDrawerOpen(false)} open={drawerOpen}>
        <div style={{ width: 280 }}>
          <Search placeholder="Search chats" onChange={e => setSearch(e.target.value)} value={search} />
          <div style={{ marginTop: 12 }}>
            {filtered.map(t => (
              <Link key={t._id} href={`/chat/${t._id}`} onClick={() => setDrawerOpen(false)}>
                <div style={{ display: 'flex', gap: 12, padding: 8, alignItems: 'center' }}>
                  <Avatar src={t.avatar}>{t.title?.[0]}</Avatar>
                  <div>
                    <div style={{ fontWeight: 500 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: '#777' }}>{t.lastMessage ?? 'No messages yet'}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Drawer> */}
    </Layout>
  );
}
