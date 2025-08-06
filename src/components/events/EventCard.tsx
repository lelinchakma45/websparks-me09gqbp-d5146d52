import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-primary-100 text-primary-800'
  };

  const categoryIcons = {
    conference: 'bi-people',
    workshop: 'bi-tools',
    seminar: 'bi-mortarboard',
    networking: 'bi-chat-dots',
    social: 'bi-heart',
    other: 'bi-calendar-event'
  };

  return (
    <Card hover className="overflow-hidden animate-slide-up">
      <div className="relative">
        <img
          src={event.image || 'https://placehold.co/400x200/e2e8f0/64748b?text=Event+Image'}
          alt={event.title}
          className="w-full h-48 object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <i className={`${categoryIcons[event.category]} text-primary-600`}></i>
          <span className="text-sm text-gray-500 capitalize">{event.category}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <i className="bi bi-calendar3 mr-2"></i>
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <i className="bi bi-geo-alt mr-2"></i>
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <i className="bi bi-people mr-2"></i>
            {event.attendees} / {event.maxAttendees} attendees
          </div>
          {event.price > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <i className="bi bi-currency-dollar mr-2"></i>
              ${event.price}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(event)}
            className="flex-1"
          >
            <i className="bi bi-pencil mr-1"></i>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(event.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
