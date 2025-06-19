'use client'

interface RoomHeaderProps {
  roomName: string
  isEncrypted: boolean
  onToggleEncryption: () => void
  canEncrypt: boolean
}

export default function RoomHeader({ 
  roomName, 
  isEncrypted, 
  onToggleEncryption, 
  canEncrypt 
}: RoomHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-3">
        <h2 className="text-lg font-semibold text-gray-800">{roomName}</h2>
        {isEncrypted && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            🔒 Encrypted
          </span>
        )}
      </div>
      
      {canEncrypt && (
        <button
          onClick={onToggleEncryption}
          className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
            isEncrypted
              ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
        >
          {isEncrypted ? 'Disable Encryption' : 'Enable Encryption'}
        </button>
      )}
    </div>
  )
} 