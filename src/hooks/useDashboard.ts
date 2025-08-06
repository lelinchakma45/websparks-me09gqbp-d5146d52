import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Dashboard } from '../types';

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*');

      if (eventsError) throw eventsError;

      const now = new Date();
      const upcomingEvents = events.filter(event => 
        new Date(event.date) >= now && event.status === 'published'
      );

      const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
      const revenue = events.reduce((sum, event) => sum + (event.price * event.attendees), 0);

      setDashboard({
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        totalAttendees,
        revenue
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
