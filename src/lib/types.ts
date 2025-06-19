export interface Message {
  id: string
  content: string
  sender_id: string
  room_id: string
  created_at: string
  encrypted: boolean
}

export interface Room {
  id: string
  name: string
  created_at: string
  encryption_key?: string
}

export interface User {
  id: string
  username: string
  avatar_url?: string
}

export interface ChatMessage {
  id: string
  content: string
  sender: string
  timestamp: string
  isEncrypted: boolean
  isOwn: boolean
} 