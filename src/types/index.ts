export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'conference' | 'workshop' | 'seminar' | 'networking' | 'social' | 'other';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  attendees: number;
  maxAttendees: number;
  price: number;
  image?: string;
  organizer: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'attendee';
  avatar?: string;
}

export interface Dashboard {
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
  revenue: number;
}
