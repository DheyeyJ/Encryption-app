import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          content: string
          sender_id: string
          room_id: string
          created_at: string
          encrypted: boolean
        }
        Insert: {
          id?: string
          content: string
          sender_id: string
          room_id: string
          created_at?: string
          encrypted?: boolean
        }
        Update: {
          id?: string
          content?: string
          sender_id?: string
          room_id?: string
          created_at?: string
          encrypted?: boolean
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          created_at: string
          encryption_key?: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          encryption_key?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          encryption_key?: string
        }
      }
    }
  }
} 