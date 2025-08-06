import React from 'react';
import StatsCard from './StatsCard';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { useDashboard } from '../../hooks/useDashboard';
import { useEvents } from '../../hooks/useEvents';

const Dashboard: React.FC = () => {
  const { dashboard, loading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboard();
  const { events, loading: eventsLoading, error: eventsError } = useEvents();

  if (dashboardLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (dashboardError || eventsError) {
    return (
      <ErrorMessage 
        message={dashboardError || eventsError || 'Failed to load dashboard data'} 
        onRetry={refetchDashboard}
      />
    );
  }

  const upcomingEvents = events
    .filter(event => event.status === 'published' && new Date(event.date) >= new Date())
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={dashboard.totalEvents}
          icon="bi-calendar-event"
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Upcoming Events"
          value={dashboard.upcomingEvents}
          icon="bi-clock"
          color="emerald"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Attendees"
          value={dashboard.totalAttendees.toLocaleString()}
          icon="bi-people"
          color="amber"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Revenue"
          value={`$${dashboard.revenue.toLocaleString()}`}
          icon="bi-currency-dollar"
          color="emerald"
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <i className="bi bi-calendar-x text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <i className="bi bi-calendar-event text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.attendees} attendees</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
          <div className="space-y-3">
            {[
              { name: 'Conferences', count: events.filter(e => e.category === 'conference').length, color: 'bg-primary-500' },
              { name: 'Workshops', count: events.filter(e => e.category === 'workshop').length, color: 'bg-emerald-500' },
              { name: 'Networking', count: events.filter(e => e.category === 'networking').length, color: 'bg-amber-500' },
              { name: 'Seminars', count: events.filter(e => e.category === 'seminar').length, color: 'bg-red-500' }
            ].map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <span className="text-sm text-gray-500">{category.count} events</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
