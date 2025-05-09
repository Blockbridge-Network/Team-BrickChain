export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          role: 'PROPERTY_OWNER' | 'INVESTOR'
          wallet_address: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          role: 'PROPERTY_OWNER' | 'INVESTOR'
          wallet_address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          role?: 'PROPERTY_OWNER' | 'INVESTOR'
          wallet_address?: string | null
        }
      }
      properties: {
        Row: {
          id: number
          created_at: string
          owner_id: string
          title: string
          description: string
          location: string
          price: number
          images: string[]
          documents: string[]
          status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'TOKENIZED'
          tokenization_details: Json | null
        }
        Insert: {
          id?: number
          created_at?: string
          owner_id: string
          title: string
          description: string
          location: string
          price: number
          images: string[]
          documents: string[]
          status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'TOKENIZED'
          tokenization_details?: Json | null
        }
        Update: {
          id?: number
          created_at?: string
          owner_id?: string
          title?: string
          description?: string
          location?: string
          price?: number
          images?: string[]
          documents?: string[]
          status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'TOKENIZED'
          tokenization_details?: Json | null
        }
      }
      investments: {
        Row: {
          id: number
          created_at: string
          investor_id: string
          property_id: number
          amount: number
          token_amount: number
          status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          transaction_hash: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          investor_id: string
          property_id: number
          amount: number
          token_amount: number
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          transaction_hash?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          investor_id?: string
          property_id?: number
          amount?: number
          token_amount?: number
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          transaction_hash?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
