'use client'

import { ChatMessage } from '@/lib/types'

interface MessageBubbleProps {
  message: ChatMessage
  username: string
}

export default function MessageBubble({ message, username }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.isOwn 
          ? 'bg-blue-500 text-white' 
          : 'bg-white border border-gray-200 text-gray-800'
      }`}>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium">
            {message.isOwn ? username : message.senderUsername || message.sender}
          </span>
          {message.isEncrypted && (
            <span className="text-xs">🔒</span>
          )}
        </div>
        <p className="text-sm break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${
          message.isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
} 