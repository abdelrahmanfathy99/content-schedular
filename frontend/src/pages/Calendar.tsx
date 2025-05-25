import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getPosts, Post } from '../services/PostService';
import { useAuth } from '../contexts/AuthContext';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Apply filter to get only scheduled posts
        const data = await getPosts(token, { status: ['scheduled'] });

        const posts: Post[] = data.posts?.data ?? [];

        const events = posts
          .filter(post => post.scheduled_time)
          .map(post => {
            const time = new Date(post.scheduled_time);
            return {
              id: post.id,
              title: post.title,
              start: time,
              end: time,
              allDay: false,
            };
          });

        setEvents(events);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledPosts();
  }, [token]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Scheduled Posts Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarView;
