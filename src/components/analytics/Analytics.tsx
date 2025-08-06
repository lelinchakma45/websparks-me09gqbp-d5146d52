import React from 'react';
import Card from '../ui/Card';
import StatsCard from '../dashboard/StatsCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { useEvents } from '../../hooks/useEvents';

const Analytics: React.FC = () => {
  const { events, loading, error, refetch } = useEvents();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  const totalRevenue = events.reduce((sum, event) => sum + (event.price * event.attendees), 0);
  const averageAttendance = events.length > 0 ? events.reduce((sum, event) => sum + event.attendees, 0) / events.length : 0;
  const completionRate = events.length > 0 ? (events.filter(event => event.status === 'completed').length / events.length) * 100 : 0;

  const categoryData = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = [
    { month: 'Jan', events: 8, revenue: 12400 },
    { month: 'Feb', events: 12, revenue: 18600 },
    { month: 'Mar', events: 15, revenue: 24800 },
    { month: 'Apr', events: 10, revenue: 16200 },
    { month: 'May', events: 18, revenue: 28900 },
    { month: 'Jun', events: 22, revenue: 35600 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
        <div className="text-sm text-gray-500">
          Data updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="bi-currency-dollar"
          color="emerald"
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Avg. Attendance"
          value={Math.round(averageAttendance)}
          icon="bi-people"
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate.toFixed(1)}%`}
          icon="bi-check-circle"
          color="amber"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Active Events"
          value={events.filter(e => e.status === 'published').length}
          icon="bi-calendar-check"
          color="emerald"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{data.month}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{data.events} Events</p>
                    <p className="text-sm text-gray-500">${data.revenue.toLocaleString()} Revenue</p>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${(data.events / 25) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
          <div className="space-y-4">
            {Object.entries(categoryData).map(([category, count]) => {
              const percentage = events.length > 0 ? (count / events.length) * 100 : 0;
              const colors = {
                conference: 'from-primary-500 to-primary-600',
                workshop: 'from-emerald-500 to-emerald-600',
                seminar: 'from-amber-500 to-amber-600',
                networking: 'from-red-500 to-red-600',
                social: 'from-purple-500 to-purple-600',
                other: 'from-gray-500 to-gray-600'
              };

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                    <span className="text-sm text-gray-500">{count} events ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${colors[category as keyof typeof colors]} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Event</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Attendees</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {events
                .sort((a, b) => (b.price * b.attendees) - (a.price * a.attendees))
                .slice(0, 5)
                .map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {event.attendees} / {event.maxAttendees}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      ${(event.price * event.attendees).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                        event.status === 'completed' ? 'bg-primary-100 text-primary-800' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
