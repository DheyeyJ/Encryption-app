'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize user map with current user
  useEffect(() => {
    setUserMap(prev => ({
      ...prev,
      [currentUserId]: username
    }))
  }, [currentUserId, username])

  // Load messages and subscribe when room changes
  useEffect(() => {
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

      const chatMessages: ChatMessage[] = data.map((msg: Message) => {
        return {
          id: msg.id,
          content: msg.encrypted && encryptionService 
            ? encryptionService.decrypt(msg.content)
            : msg.content,
          sender: msg.sender_id,
          senderUsername: msg.sender_username,
          timestamp: msg.created_at,
          isEncrypted: msg.encrypted,
          isOwn: msg.sender_id === currentUserId
        }
      })

      setMessages(chatMessages)
    }

    const subscribeToMessages = () => {
      console.log('Setting up real-time subscription for room:', room.id)

      const subscription = supabase
        .channel(`room:${room.id}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` },
          (payload) => {
            console.log('New message received:', payload)
            const newMsg = payload.new as Message
            
            const chatMessage: ChatMessage = {
              id: newMsg.id,
              content: newMsg.encrypted && encryptionService 
                ? encryptionService.decrypt(newMsg.content)
                : newMsg.content,
              sender: newMsg.sender_id,
              senderUsername: newMsg.sender_username,
              timestamp: newMsg.created_at,
              isEncrypted: newMsg.encrypted,
              isOwn: newMsg.sender_id === currentUserId
            }
            setMessages(prev => [...prev, chatMessage])
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status)
        })

      return () => {
        console.log('Unsubscribing from room:', room.id)
        subscription.unsubscribe()
      }
    }

    loadMessages()
    const unsubscribe = subscribeToMessages()
    return unsubscribe
  }, [room.id, currentUserId, encryptionService])

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

  // Periodic refresh to ensure messages are up-to-date
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMessages()
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [room.id, currentUserId, encryptionService])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageText = newMessage.trim()
    setNewMessage('') // Clear input immediately for better UX

    let content = messageText
    let encrypted = false

    if (encryptionService && isEncrypted) {
      content = encryptionService.encrypt(messageText)
      encrypted = true
    }

    // Debug: Log the username being sent
    console.log('Sending message with username:', username)

    const { error } = await supabase
      .from('messages')
      .insert({
        content,
        sender_id: currentUserId,
        sender_username: username,
        room_id: room.id,
        encrypted
      })

    // Debug: Log the error object
    if (error) {
      console.error('Error sending message:', JSON.stringify(error, null, 2), error)
      // Restore the message if sending failed
      setNewMessage(messageText)
      alert('Failed to send message. Please try again.')
      return
    }

    console.log('Message sent successfully')
    
    // Auto-refresh messages after sending
    setTimeout(() => {
      refreshMessages()
    }, 500) // Small delay to ensure the message is saved
  }

  const refreshMessages = async () => {
    if (isRefreshing) return // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error refreshing messages:', error)
      setIsRefreshing(false)
      return
    }

    const chatMessages: ChatMessage[] = data.map((msg: Message) => {
      return {
        id: msg.id,
        content: msg.encrypted && encryptionService 
          ? encryptionService.decrypt(msg.content)
          : msg.content,
        sender: msg.sender_id,
        senderUsername: msg.sender_username,
        timestamp: msg.created_at,
        isEncrypted: msg.encrypted,
        isOwn: msg.sender_id === currentUserId
      }
    })

    setMessages(chatMessages)
    setIsRefreshing(false)
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
        onRefresh={refreshMessages}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isRefreshing && (
          <div className="flex justify-center py-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Refreshing messages...</span>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            username={userMap[message.sender] || 'Unknown User'}
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 text-gray-600"
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