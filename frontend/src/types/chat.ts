// put in /types/chat.ts or similar
export interface Topic {
  _id: string;
  title: string;
  avatar?: string;
  lastMessage?: string;
  updatedAt?: string;
}

export type MediaFile = {
  url: string;
  name?: string;
  type?: string;
};

export interface Message {
  _id: string;
  topic_id: string;
  sender_id: string | { _id: string; name?: string; avatar?: string };
  content: {
    text?: string;
    media?: MediaFile[];
  };
  createdAt: string;
  read_by?: string[];
}
