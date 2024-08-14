import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ViewToggle = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1em;

  &:hover {
    background-color: #555;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #007BFF;
  `}
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

const DayBox = styled.div`
  padding: 20px;
  background-color: ${(props) => (props.isToday ? '#007BFF' : '#333')};
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }

  ${(props) =>
    props.isSelected &&
    `
    background-color: #FF6347;
  `}
`;

const EventDetails = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #444;
  border-radius: 10px;
`;

const InputField = styled.input`
  background-color: #555;
  border: none;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: calc(100% - 20px);

  &:focus {
    outline: none;
  }
`;

const TimeFieldContainer = styled.div`
  position: relative;
  width: calc(100% - 20px);
`;

const TimeIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5em;
  color: #fff;
  cursor: pointer;
  z-index: 10;
`;

const TimeField = styled.input`
  background-color: #555;
  border: none;
  color: white;
  padding: 10px 10px 10px 45px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: 100%;
  font-size: 1em;
  appearance: none;
  position: relative;

  &:focus {
    outline: none;
  }
`;

const TextArea = styled.textarea`
  background-color: #555;
  border: none;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: calc(100% - 20px);
  height: 100px;

  &:focus {
    outline: none;
  }
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #218838;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8em;

  &:hover {
    background-color: #c82333;
  }
`;

const SelectField = styled.select`
  background-color: #555;
  border: none;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: calc(100% - 20px);

  &:focus {
    outline: none;
  }
`;

const Calendar = () => {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState('none');

  useEffect(() => {
    setSelectedDate(new Date());
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(checkForUpcomingEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events]);

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDays = () => {
    const days = [];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInThisMonth = daysInMonth(month, year);
    for (let i = 1; i <= daysInThisMonth; i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }
    return days;
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setTitle('');
    setTime('');
    setDescription('');
  };

  const addEvent = () => {
    const dateKey = selectedDate.toDateString();
    const newEvent = {
      id: Date.now(), // Use timestamp as unique ID
      title,
      time,
      description,
      recurrence,
    };

    setEvents({
      ...events,
      [dateKey]: [...(events[dateKey] || []), newEvent],
    });

    setTitle('');
    setTime('');
    setDescription('');
    setRecurrence('none');
  };

  const deleteEvent = (dateKey, eventId) => {
    const updatedEvents = {
      ...events,
      [dateKey]: events[dateKey].filter((event) => event.id !== eventId),
    };
    setEvents(updatedEvents);
  };

  const checkForUpcomingEvents = () => {
    const now = new Date();
    Object.keys(events).forEach((dateKey) => {
      events[dateKey].forEach((event) => {
        const eventTime = new Date(`${dateKey} ${event.time}`);
        if (
          eventTime > now &&
          eventTime - now <= 60000 // Trigger if event is within the next minute
        ) {
          sendNotification(event.title, event.description);
        }
      });
    });
  };

  const sendNotification = (title, description) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: description,
        icon: 'path/to/icon.png',
      });
    }
  };

  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleTimeIconClick = () => {
    document.getElementById('timePicker').showPicker();
  };

  const renderEventDetails = () => {
    const dateKey = selectedDate.toDateString();
    const dayEvents = events[dateKey] || [];
    return dayEvents.map((event) => (
      <div key={event.id}>
        <h3>{event.title}</h3>
        <p>{event.time}</p>
        <p>{event.description}</p>
        <DeleteButton onClick={() => deleteEvent(dateKey, event.id)}>
          Delete
        </DeleteButton>
      </div>
    ));
  };

  return (
    <CalendarContainer>
      <ViewToggle>
        <ToggleButton
          active={view === 'month'}
          onClick={() => setView('month')}
        >
          Month
        </ToggleButton>
        <ToggleButton active={view === 'week'} onClick={() => setView('week')}>
          Week
        </ToggleButton>
        <ToggleButton active={view === 'year'} onClick={() => setView('year')}>
          Year
        </ToggleButton>
      </ViewToggle>
      <CalendarGrid>
        {generateDays().map((day) => (
          <DayBox
            key={day}
            onClick={() => handleDayClick(day)}
            isToday={day.toDateString() === new Date().toDateString()}
            isSelected={day.toDateString() === selectedDate.toDateString()}
          >
            {day.getDate()}
          </DayBox>
        ))}
      </CalendarGrid>
      <EventDetails>
        <h2>Event Details</h2>
        <InputField
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TimeFieldContainer>
          <TimeIcon onClick={handleTimeIconClick}>🕒</TimeIcon>
          <TimeField
            id="timePicker"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </TimeFieldContainer>
        <TextArea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <SelectField
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
        >
          <option value="none">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </SelectField>
        <AddButton onClick={addEvent}>Add Event</AddButton>
        {renderEventDetails()}
      </EventDetails>
    </CalendarContainer>
  );
};

export default Calendar;
