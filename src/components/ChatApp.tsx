'use client'

import { useState } from 'react'
import { Room } from '@/lib/types'
import RoomList from './RoomList'
import ChatRoom from './ChatRoom'
import Auth from './Auth'
import { User } from '@supabase/supabase-js'

export default function ChatApp() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
  }

  if (!currentUser) {
    return <Auth onAuth={setCurrentUser} />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <Auth onAuth={setCurrentUser} />
        <div className="flex flex-1">
          <RoomList
            onRoomSelect={handleRoomSelect}
            currentRoomId={selectedRoom?.id}
          />
          <div className="flex-1">
            {selectedRoom ? (
              <ChatRoom
                room={selectedRoom}
                currentUserId={currentUser.id}
                username={currentUser.user_metadata?.username || currentUser.email || currentUser.id}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                    Welcome to EnChat
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Select a room from the sidebar to start chatting
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <span>🔒</span>
                    <span>End-to-end encryption available</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}