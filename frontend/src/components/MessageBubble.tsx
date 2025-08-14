import { Message } from '@/types/chat';
import { CheckOutlined } from '@ant-design/icons';
import { Avatar, Card, Tooltip } from 'antd';
import { format } from 'date-fns';

export default function MessageBubble({ message, currentUserId }: { message: Message; currentUserId: string }) {
  const senderObj: { _id: string; name?: string; avatar?: string } =
    message?.sender_id && typeof message.sender_id === 'string'
      ? { _id: message.sender_id, name: 'Unknown' }
      : (message?.sender_id as { _id: string; name?: string; avatar?: string }) || { _id: 'unknown', name: 'Unknown' };

  const isMine = senderObj._id === currentUserId;
  const time = message.createdAt ? format(new Date(message.createdAt), 'h:mm a') : '';

  console.log('message bubble', message, currentUserId, isMine);

  return (
    <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
      {!isMine && (
        <div style={{ marginRight: 10 }}>
          <Avatar src={senderObj.avatar}>{senderObj.name?.[0]}</Avatar>
        </div>
      )}

      <div style={{ maxWidth: '75%' }}>
        <Card
          style={{ background: isMine ? '#e6f7ff' : '#fafafa', padding: 12, borderRadius: 12 }}
          bodyStyle={{ padding: 0 }}
        >
          {!isMine && <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{senderObj.name}</div>}
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content?.text}</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tooltip title={message.createdAt}>
              <span style={{ fontSize: 12, color: '#888' }}>{time}</span>
            </Tooltip>
            {isMine && <CheckOutlined style={{ color: (message.read_by && message.read_by.length) ? '#1890ff' : '#999', fontSize: 12 }} />}
          </div>
        </Card>

        {message.content?.media?.map((m, i) => (
          m.type?.startsWith('image') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={m.url} alt={m.name || 'attachment'} style={{ marginTop: 8, borderRadius: 8, maxWidth: 300 }} />
          ) : (
            <a key={i} href={m.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8 }}>
              📎 {m.name || 'file'}
            </a>
          )
        ))}
      </div>
    </div>
  );
}