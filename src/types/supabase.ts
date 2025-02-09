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
      analytics: {
        Row: {
          content_id: string | null
          id: string
          metadata: Json | null
          newsletter_id: string | null
          recorded_at: string | null
          type: string
          value: number
        }
        Insert: {
          content_id?: string | null
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          recorded_at?: string | null
          type: string
          value: number
        }
        Update: {
          content_id?: string | null
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          recorded_at?: string | null
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          }
        ]
      }
      content: {
        Row: {
          ai_generated: boolean | null
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          newsletter_id: string | null
          published_at: string | null
          scheduled_for: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          }
        ]
      }
      newsletters: {
        Row: {
          beehiiv_publication_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          settings: Json | null
          status: string | null
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          beehiiv_publication_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          beehiiv_publication_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          metadata: Json | null
          newsletter_id: string | null
          status: string | null
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          status?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          status?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscribers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      workspace_members: {
        Row: {
          created_at: string | null
          role: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          role?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          role?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}