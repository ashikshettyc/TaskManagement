/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';

import { useEffect, useState } from 'react';
import Loading from '@/component/Loading';
import { Box, Stack } from '@mui/material';

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

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

      const calendarEvents = data.map(
        (task: {
          id: any;
          title: any;
          deadline: string | number | Date;
          submitted: any;
          approved: any;
          rejected: any;
          user: { name: any };
        }) => ({
          id: task.id,
          title: task.title,
          start: new Date(task.deadline),
          end: new Date(task.deadline),
          allDay: true,
          submitted: task.submitted,
          approved: task.approved,
          rejected: task.rejected,
          user: task.user?.name,
        })
      );

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
  console.log(events);
  const eventStyleGetter = (event: {
    approved: boolean;
    submitted: boolean;
    rejected: boolean;
  }) => {
    let backgroundColor = '#ccc';

    if (event.approved) backgroundColor = '#4caf50';
    else if (event.rejected) backgroundColor = '#f44336';
    else if (event.submitted) backgroundColor = '#2196f3';
    else backgroundColor = '#f58c36';

    return {
      style: {
        backgroundColor,
        color: '#fff',
        borderRadius: '5px',
        padding: '2px 6px',
      },
    };
  };

  // Dismiss tooltip on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedEvent(null);
      setTooltipPosition(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleEventClick = (event: any, e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEvent(event);
    setTooltipPosition({ x: e.clientX - 150, y: e.clientY });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEventColor = (event: any) => {
    if (event.approved) return '#4caf50';
    if (event.rejected) return '#f44336';
    if (event.submitted) return '#2196f3';
    return '#f58c36';
  };

  return (
    <Box
      sx={{
        padding: {
          xs: '2rem 0',
          lg: '2rem',
        },
      }}
      style={{
        height: '80vh',

        position: 'relative',
        width: '100vw',
      }}
    >
      {loading ? (
        <Box justifyContent={'center'} alignItems={'center'} width={'100%'}>
          <Loading />
        </Box>
      ) : events.length === 0 ? (
        <div>No tasks available</div>
      ) : (
        <Stack
          sx={{
            width: {
              xs: '100vw',
              lg: '70vw',
            },
            height: '100vw',
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            style={{ height: '100%', width: '100%' }}
            eventPropGetter={eventStyleGetter}
            toolbar={false}
            popup={true}
            onSelectEvent={(event, e) => handleEventClick(event, e)}
          />
        </Stack>
      )}

      {/* Tooltip for event details */}
      {selectedEvent && tooltipPosition && (
        <div
          style={{
            position: 'absolute',
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: getEventColor(selectedEvent),
            color: '#fff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            maxWidth: '300px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <strong>{selectedEvent.title}</strong>
          <div>
            <b>Creator:</b> {selectedEvent.user}
          </div>
          <div>
            <b>End:</b> {new Date(selectedEvent.end).toLocaleString()}
          </div>
          <div>
            Status:{' '}
            {selectedEvent.approved
              ? 'Approved'
              : selectedEvent.rejected
              ? 'Rejected'
              : selectedEvent.submitted
              ? 'Submitted'
              : 'Pending'}
          </div>
        </div>
      )}
    </Box>
  );
};

export default MyCalendar;
