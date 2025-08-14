import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Upload, Tooltip } from 'antd';
import { PaperClipOutlined, SmileOutlined, SendOutlined, AudioOutlined } from '@ant-design/icons';
import { MediaFile } from '@/types/chat';

const { TextArea } = Input;

export default function MessageInput({ topicId, userId, onSend, onTyping }: { topicId: string; userId: string; onSend: (content: { text?: string; media?: MediaFile[] }) => void; onTyping?: () => void; }) {
  const [text, setText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, []);

  const notifyTyping = () => {
    onTyping?.();
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => {
      // local stop
    }, 2000);
  };

  const handleUpload = ({ file, fileList }: any) => {
    // create local preview; in production upload to server
    const f = file.originFileObj;
    if (f) {
      const url = URL.createObjectURL(f);
      setMediaFiles(prev => [...prev, { url, name: f.name, type: f.type }]);
    }
    return false; // prevent auto upload
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() && mediaFiles.length === 0) return;
    const payload = { text: text.trim() || undefined, media: mediaFiles.length ? mediaFiles : undefined };
    onSend(payload);
    setText('');
    setMediaFiles([]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <form onSubmit={send} style={{ padding: 12, display: 'flex', gap: 8, alignItems: 'flex-end', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
      <Upload beforeUpload={() => false} multiple showUploadList={false} customRequest={() => {}} onChange={handleUpload} accept="image/*,.pdf,.doc,.docx">
        <Tooltip title="Attach">
          <Button icon={<PaperClipOutlined />} />
        </Tooltip>
      </Upload>

      <div style={{ flex: 1 }}>
        <TextArea ref={textareaRef as any} value={text} onChange={(e) => { setText(e.target.value); notifyTyping(); }} onKeyDown={onKeyDown} placeholder="Type a message" autoSize={{ minRows: 1, maxRows: 6 }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button icon={<SmileOutlined />} />
        {text.trim() || mediaFiles.length ? (
          <Button type="primary" htmlType="submit" icon={<SendOutlined />} />
        ) : (
          <Button icon={<AudioOutlined />} />
        )}
      </div>
    </form>
  );
}