'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { EncryptionService } from '@/lib/crypto'
import { Message, Room, ChatMessage } from '@/lib/types'
import MessageBubble from './MessageBubble'
import RoomHeader from './RoomHeader'

interface ChatRoomProps {
  room: Room
  currentUserId: string
  username: string
}

export default function ChatRoom({ room, currentUserId, username }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [encryptionService, setEncryptionService] = useState<EncryptionService | null>(null)
  const [isEncrypted, setIsEncrypted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Set encryption service when room changes
  useEffect(() => {
    if (room.encryption_key) {
      setEncryptionService(new EncryptionService(room.encryption_key))
      setIsEncrypted(true)
    } else {
      setEncryptionService(null)
      setIsEncrypted(false)
    }
  }, [room.id, room.encryption_key])

  // Load messages and subscribe when encryptionService is ready
  useEffect(() => {
    if (room.encryption_key && !encryptionService) return
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', room.id)
        .order('created_at', { ascending: true })

      console.log('Loaded messages:', data)
      if (error) {
        console.error('Error loading messages:', JSON.stringify(error, null, 2))
        return
      }

      const chatMessages: ChatMessage[] = data.map((msg: Message) => ({
        id: msg.id,
        content: msg.encrypted && encryptionService 
          ? encryptionService.decrypt(msg.content)
          : msg.content,
        sender: msg.sender_id,
        timestamp: msg.created_at,
        isEncrypted: msg.encrypted,
        isOwn: msg.sender_id === currentUserId
      }))

      setMessages(chatMessages)
    }

    const subscribeToMessages = () => {
      const subscription = supabase
        .channel(`room:${room.id}`)
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` },
          (payload) => {
            const newMsg = payload.new as Message
            const chatMessage: ChatMessage = {
              id: newMsg.id,
              content: newMsg.encrypted && encryptionService 
                ? encryptionService.decrypt(newMsg.content)
                : newMsg.content,
              sender: newMsg.sender_id,
              timestamp: newMsg.created_at,
              isEncrypted: newMsg.encrypted,
              isOwn: newMsg.sender_id === currentUserId
            }
            setMessages(prev => [...prev, chatMessage])
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }

    loadMessages()
    const unsubscribe = subscribeToMessages()
    return unsubscribe
  }, [encryptionService, room.id, room.encryption_key, currentUserId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    let content = newMessage
    let encrypted = false

    if (encryptionService && isEncrypted) {
      content = encryptionService.encrypt(newMessage)
      encrypted = true
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        content,
        sender_id: currentUserId,
        room_id: room.id,
        encrypted
      })

    if (error) {
      console.error('Error sending message:', error)
      return
    }

    setNewMessage('')
  }

  const toggleEncryption = () => {
    if (!room.encryption_key) {
      alert('This room does not support encryption')
      return
    }
    setIsEncrypted(!isEncrypted)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <RoomHeader 
        roomName={room.name} 
        isEncrypted={isEncrypted}
        onToggleEncryption={toggleEncryption}
        canEncrypt={!!room.encryption_key}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            username={username}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isEncrypted ? "Type encrypted message..." : "Type message..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
        {isEncrypted && (
          <p className="text-xs text-green-600 mt-2">
            🔒 Messages are encrypted
          </p>
        )}
      </form>
    </div>
  )
} 