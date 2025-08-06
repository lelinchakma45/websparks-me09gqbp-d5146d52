import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Event } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEvents: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        status: event.status,
        attendees: event.attendees,
        maxAttendees: event.max_attendees,
        price: event.price,
        image: event.image,
        organizer: event.organizer,
        createdAt: event.created_at,
        updatedAt: event.updated_at
      }));

      setEvents(formattedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: eventData.title!,
          description: eventData.description!,
          date: eventData.date!,
          time: eventData.time!,
          location: eventData.location!,
          category: eventData.category!,
          max_attendees: eventData.maxAttendees!,
          price: eventData.price || 0,
          image: eventData.image,
          organizer: eventData.organizer || 'Current User',
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      const newEvent: Event = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        category: data.category,
        status: data.status,
        attendees: data.attendees,
        maxAttendees: data.max_attendees,
        price: data.price,
        image: data.image,
        organizer: data.organizer,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          category: eventData.category,
          max_attendees: eventData.maxAttendees,
          price: eventData.price,
          image: eventData.image,
          status: eventData.status
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;

      const updatedEvent: Event = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        category: data.category,
        status: data.status,
        attendees: data.attendees,
        maxAttendees: data.max_attendees,
        price: data.price,
        image: data.image,
        organizer: data.organizer,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ));
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  };
};
