import React from 'react';
import { Tag } from 'antd';

export default function TypingIndicator({ userIds }: { userIds: string[] }) {
  if (!userIds || userIds.length === 0) return null;
  const text = userIds.length === 1 ? `${userIds[0]} is typing...` : `${userIds.length} people typing...`;
  return <Tag style={{ background: 'transparent', border: 0 }}>{text}</Tag>;
}