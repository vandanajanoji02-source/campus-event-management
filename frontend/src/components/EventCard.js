import React, { useEffect, useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrationAPI } from '../services/api';

function EventCard({ event }) {
  const { isAuthenticated } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkRegistration = async () => {
      if (!isAuthenticated || !event._id) {
        return;
      }

      try {
        setLoadingStatus(true);
        const response = await registrationAPI.checkRegistration(event._id);
        if (isMounted && response.data.success) {
          setIsRegistered(response.data.isRegistered);
          setRegistrationStatus(response.data.registrationStatus);
        }
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        if (isMounted) {
          setLoadingStatus(false);
        }
      }
    };

    checkRegistration();

    return () => {
      isMounted = false;
    };
  }, [event._id, isAuthenticated]);

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const categoryColors = {
    technical: 'primary',
    cultural: 'success',
    sports: 'danger',
    academic: 'info',
    other: 'secondary'
  };
  const capacityPercentage = event.capacity > 0
    ? Math.round((event.registrationCount / event.capacity) * 100)
    : 0;
  const isFull = event.registrationCount >= event.capacity;

  return (
    <Card className="event-card h-100">
      {event.image && (
        <Card.Img
          variant="top"
          src={event.image}
          alt={event.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{event.title}</Card.Title>
          {!loadingStatus && isRegistered && (
            <Badge bg="success" className="ms-2">Registered</Badge>
          )}
          {!loadingStatus && !isRegistered && registrationStatus === 'cancelled' && (
            <Badge bg="warning" className="ms-2">Cancelled</Badge>
          )}
        </div>

        <div className="mb-2">
          <Badge bg={categoryColors[event.category] || 'secondary'} className="me-2">
            {event.category}
          </Badge>
          <Badge bg={isUpcoming ? 'success' : 'secondary'}>
            {isUpcoming ? 'Upcoming' : 'Past'}
          </Badge>
        </div>

        <Card.Text className="text-muted small mb-2">
          {event.description.substring(0, 80)}...
        </Card.Text>

        <div className="mb-3">
          <small className="d-block">Location: {event.location}</small>
          <small className="d-block">
            Date: {eventDate.toLocaleDateString('en-IN')} at {event.time}
          </small>
        </div>

        <div className="mb-3">
          <div className="progress" style={{ height: '20px' }}>
            <div
              className={`progress-bar ${isFull ? 'bg-danger' : 'bg-success'}`}
              role="progressbar"
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              aria-valuenow={capacityPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {capacityPercentage}%
            </div>
          </div>
          <small className="text-muted">
            {event.registrationCount} / {event.capacity} registered
          </small>
          {isFull && <Badge bg="danger" className="d-block mt-2">Event Full</Badge>}
        </div>

        <Link
          to={`/events/${event._id}`}
          className={`btn w-100 ${isRegistered ? 'btn-secondary' : 'btn-primary'}`}
        >
          {isRegistered ? 'Registered' : 'View Details'}
        </Link>
      </Card.Body>
    </Card>
  );
}

export default EventCard;
