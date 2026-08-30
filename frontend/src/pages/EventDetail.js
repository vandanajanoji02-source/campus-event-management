import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, registrationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && event) {
      checkRegistration();
    }
  }, [event, isAuthenticated]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEventById(id);
      setEvent(response.data.event);
      setError('');
    } catch (err) {
      setError('Failed to load event details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const response = await registrationAPI.checkRegistration(id);
      setIsRegistered(response.data.isRegistered);
    } catch (err) {
      console.error('Error checking registration:', err);
      setError('Failed to load registration status');
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      setError('');
      await registrationAPI.registerForEvent(id);
      setSuccess('Successfully registered for the event!');
      setIsRegistered(true);
      setTimeout(() => setSuccess(''), 5000);
      fetchEventDetails();
      checkRegistration();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to register for event';
      setError(errorMsg);
      setTimeout(() => setError(''), 5000);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Event not found</Alert>
      </Container>
    );
  }

  const eventDate = new Date(event.date);
  const today = new Date();
  const isUpcoming = eventDate > today;
  const capacityPercentage = Math.round((event.registrationCount / event.capacity) * 100);
  const isFull = event.registrationCount >= event.capacity;
  const registrationDeadline = new Date(event.registrationDeadline);
  const isDeadlineOver = today > registrationDeadline;
  const availableSeats = event.capacity - event.registrationCount;

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'primary',
      cultural: 'success',
      sports: 'danger',
      academic: 'info',
      other: 'secondary'
    };
    return colors[category] || 'secondary';
  };

  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={8}>
          <div className="event-details">
            <div className="mb-4">
              <Badge bg={getCategoryColor(event.category)} className="me-2">
                {event.category}
              </Badge>
              {isUpcoming ? (
                <Badge bg="success">Upcoming</Badge>
              ) : (
                <Badge bg="secondary">Past</Badge>
              )}
            </div>

            <h1 className="mb-4">{event.title}</h1>

            <div className="mb-4">
              <h5>Event Details</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>📅 Date & Time:</strong> {eventDate.toLocaleDateString('en-IN')} at {event.time}
                </li>
                <li className="mb-2">
                  <strong>📍 Location:</strong> {event.location}
                </li>
                <li className="mb-2">
                  <strong>👤 Organizer:</strong> {event.organizer?.name}
                </li>
                <li className="mb-2">
                  <strong>🎟️ Capacity:</strong> {event.capacity} students
                </li>
                <li className="mb-2">
                  <strong>📝 Deadline:</strong> {registrationDeadline.toLocaleDateString('en-IN')}
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h5>Description</h5>
              <p>{event.description}</p>
            </div>

            {event.tags && event.tags.length > 0 && (
              <div className="mb-4">
                <h5>Tags</h5>
                <div>
                  {event.tags.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-2 mb-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Col>

        <Col md={4}>
          <div className="stats-card mb-4">
            <h3>{capacityPercentage}%</h3>
            <p>Capacity Filled</p>
            <div className="progress" style={{ height: '20px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                aria-valuenow={capacityPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <small className="mt-2 d-block">
              {event.registrationCount} / {event.capacity} registered
            </small>
          </div>

          {isAuthenticated && user?.role === 'student' && (
            <div className="card p-3 mb-4">
              {isDeadlineOver ? (
                <Alert variant="danger" className="mb-0">
                  <strong>❌ Registration Closed</strong>
                  <p className="mb-0 mt-2 small">
                    The registration deadline for this event has passed.
                  </p>
                </Alert>
              ) : isRegistered ? (
                <Alert variant="success" className="mb-0">
                  <strong>✓ You are Registered!</strong>
                  <p className="mb-0 mt-2 small">
                    You are successfully registered. We look forward to seeing you at the event.
                  </p>
                </Alert>
              ) : isFull ? (
                <Alert variant="warning" className="mb-0">
                  <strong>⚠️ Event is Full</strong>
                  <p className="mb-0 mt-2 small">
                    This event has reached maximum capacity ({event.capacity} students).
                  </p>
                </Alert>
              ) : (
                <div>
                  <p className="mb-2 text-success">
                    <strong>✓ {availableSeats} seat(s) available</strong>
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100"
                    onClick={handleRegister}
                    disabled={registering}
                  >
                    {registering ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Registering...
                      </>
                    ) : (
                      'Register Now'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="card p-3 mb-4">
              <Button
                variant="primary"
                size="lg"
                className="w-100"
                onClick={() => navigate('/login')}
              >
                Login to Register
              </Button>
            </div>
          )}

          {isAuthenticated && (user?.role === 'admin' || user?.role === 'organizer') && (
            <div className="card p-3">
              <p className="text-muted mb-2">Management Actions</p>
              <Button
                variant="outline-primary"
                size="sm"
                className="w-100"
                onClick={() => navigate(`/admin?viewStats=${id}`)}
              >
                View Registrations & Stats
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EventDetail;
