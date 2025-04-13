'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';

import { useEffect, useState } from 'react';
import { Task } from '@prisma/client';
import Loading from '@/component/Loading';
import { Box } from '@mui/material';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      const res = await fetch('/api/task', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('fetched', data);

      const calendarEvents = data.map((task: Task) => ({
        id: task.id,
        title: task.title,
        start: new Date(task.deadline),
        end: new Date(task.deadline),
        allDay: true,
        submitted: task.submitted,
        approved: task.approved,
      }));

      setEvents(calendarEvents);
    } catch (err) {
      console.error('Failed to fetch tasks for calendar', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const eventStyleGetter = (event: {
    approved: boolean;
    submitted: boolean;
    rejected: boolean;
  }) => {
    let backgroundColor = '#ccc';

    if (event.approved) backgroundColor = '#4caf50';
    else if (event.submitted) backgroundColor = '#2196f3';
    else if (event.rejected) backgroundColor = '#f44336';
    else backgroundColor = 'warning';

    return {
      style: {
        backgroundColor,
        color: '#fff',
        borderRadius: '5px',
        padding: '2px 6px',
      },
    };
  };

  if (loading) {
    return (
      <Box justifyContent={'center'} alignItems={'center'} width={'100%'}>
        <Loading />
      </Box>
    );
  }

  return (
    <div style={{ height: '80vh', padding: '2rem' }}>
      {events.length === 0 ? (
        <div>No tasks available</div>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          style={{ height: '100%', width: '70vw' }}
          eventPropGetter={eventStyleGetter}
          toolbar={false}
        />
      )}
    </div>
  );
};

export default MyCalendar;
