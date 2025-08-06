import { Event, Dashboard } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders for cutting-edge technology discussions and networking opportunities.',
    date: '2024-03-15',
    time: '09:00',
    location: 'San Francisco Convention Center',
    category: 'conference',
    status: 'published',
    attendees: 245,
    maxAttendees: 500,
    price: 299,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    organizer: 'TechCorp Events',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    title: 'Digital Marketing Workshop',
    description: 'Learn the latest digital marketing strategies from industry experts.',
    date: '2024-03-22',
    time: '14:00',
    location: 'Downtown Business Center',
    category: 'workshop',
    status: 'published',
    attendees: 89,
    maxAttendees: 150,
    price: 149,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    organizer: 'Marketing Pro',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '3',
    title: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs and potential investors in a relaxed atmosphere.',
    date: '2024-03-28',
    time: '18:30',
    location: 'Rooftop Lounge, City Center',
    category: 'networking',
    status: 'published',
    attendees: 156,
    maxAttendees: 200,
    price: 75,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
    organizer: 'Startup Hub',
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-25T13:20:00Z'
  },
  {
    id: '4',
    title: 'AI & Machine Learning Seminar',
    description: 'Explore the future of artificial intelligence and its applications across industries.',
    date: '2024-04-05',
    time: '10:00',
    location: 'University Tech Campus',
    category: 'seminar',
    status: 'draft',
    attendees: 0,
    maxAttendees: 300,
    price: 199,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    organizer: 'AI Research Institute',
    createdAt: '2024-02-01T08:15:00Z',
    updatedAt: '2024-02-05T10:30:00Z'
  }
];

export const mockDashboard: Dashboard = {
  totalEvents: 12,
  upcomingEvents: 8,
  totalAttendees: 1247,
  revenue: 89650
};
