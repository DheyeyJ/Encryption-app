'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Room } from '@/lib/types'
import { generateRoomKey } from '@/lib/crypto'

interface RoomListProps {
  onRoomSelect: (room: Room) => void
  currentRoomId?: string
}

export default function RoomList({ onRoomSelect, currentRoomId }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isEncrypted, setIsEncrypted] = useState(false)

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading rooms:', error)
      return
    }

    setRooms(data || [])
  }

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    const roomData: {
      name: string
      encryption_key?: string
    } = {
      name: newRoomName,
    }

    if (isEncrypted) {
      roomData.encryption_key = generateRoomKey()
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert(roomData)
      .select()
      .single()

    if (error) {
      console.error('Error creating room:', error)
      return
    }

    setRooms(prev => [data, ...prev])
    setNewRoomName('')
    setShowCreateForm(false)
    setIsEncrypted(false)
    onRoomSelect(data)
  }

  const deleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId)

    if (error) {
      console.error('Error deleting room:', error)
      return
    }

    setRooms(prev => prev.filter(room => room.id !== roomId))
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Chat Rooms</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showCreateForm ? 'Cancel' : 'Create New Room'}
        </button>
      </div>

      {showCreateForm && (
        <div className="p-4 border-b bg-gray-50">
          <form onSubmit={createRoom}>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 text-gray-600"
            />
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="encrypted"
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="encrypted" className="text-sm text-gray-700">
                Enable encryption
              </label>
            </div>
            <button
              type="submit"
              className="mt-2 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Create Room
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
              currentRoomId === room.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => onRoomSelect(room)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{room.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {room.encryption_key && (
                    <span className="text-xs text-green-600">🔒 Encrypted</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(room.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteRoom(room.id)
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 