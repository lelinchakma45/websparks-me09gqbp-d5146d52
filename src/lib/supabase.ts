import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase';

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          category: 'conference' | 'workshop' | 'seminar' | 'networking' | 'social' | 'other';
          status: 'draft' | 'published' | 'cancelled' | 'completed';
          attendees: number;
          max_attendees: number;
          price: number;
          image: string | null;
          organizer: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          category: 'conference' | 'workshop' | 'seminar' | 'networking' | 'social' | 'other';
          status?: 'draft' | 'published' | 'cancelled' | 'completed';
          attendees?: number;
          max_attendees: number;
          price?: number;
          image?: string | null;
          organizer: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          time?: string;
          location?: string;
          category?: 'conference' | 'workshop' | 'seminar' | 'networking' | 'social' | 'other';
          status?: 'draft' | 'published' | 'cancelled' | 'completed';
          attendees?: number;
          max_attendees?: number;
          price?: number;
          image?: string | null;
          organizer?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'admin' | 'organizer' | 'attendee';
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role?: 'admin' | 'organizer' | 'attendee';
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'organizer' | 'attendee';
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          registration_date: string;
          status: 'registered' | 'cancelled' | 'attended';
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          registration_date?: string;
          status?: 'registered' | 'cancelled' | 'attended';
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          registration_date?: string;
          status?: 'registered' | 'cancelled' | 'attended';
          created_at?: string;
        };
      };
    };
  };
};
