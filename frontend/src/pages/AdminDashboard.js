import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventAPI, registrationAPI } from '../services/api';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAdminEvents();
  }, []);

  const fetchAdminEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllEvents();
      setEvents(response.data.events || []);
      setError('');
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStats = async (event) => {
    try {
      setSelectedEvent(event);
      const response = await eventAPI.getEventStatistics(event._id);
      setStats(response.data.stats);
      setShowStatsModal(true);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  const handleViewRegistrations = async (event) => {
    try {
      setSelectedEvent(event);
      const response = await registrationAPI.getEventRegistrations(event._id);
      setRegistrations(response.data.registrations || []);
      setShowRegistrationsModal(true);
    } catch (err) {
      setError('Failed to load registrations');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setDeleting(eventId);
        await eventAPI.deleteEvent(eventId);
        fetchAdminEvents();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete event');
      } finally {
        setDeleting(null);
      }
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

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/create-event" className="btn btn-primary">
          + Create Event
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {events.length === 0 ? (
        <div className="no-results">
          <h3>No events created yet</h3>
          <p>Start by creating your first event</p>
          <Link to="/admin/create-event" className="btn btn-primary">
            Create Event
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Event Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Registrations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>
                    <strong>{event.title}</strong>
                    <br />
                    <Badge bg="secondary">{event.category}</Badge>
                  </td>
                  <td>
                    {new Date(event.date).toLocaleDateString('en-IN')}
                    <br />
                    <small className="text-muted">{event.time}</small>
                  </td>
                  <td>{event.location}</td>
                  <td>
                    <strong>{event.registrationCount}</strong> / {event.capacity}
                  </td>
                  <td>
                    <div className="btn-group-vertical w-100">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleViewStats(event)}
                        className="mb-1"
                      >
                        Statistics
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleViewRegistrations(event)}
                        className="mb-1"
                      >
                        View Students
                      </Button>
                      <Link
                        to={`/events/${event._id}`}
                        className="btn btn-primary btn-sm mb-1"
                      >
                        View Event
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteEvent(event._id)}
                        disabled={deleting === event._id}
                      >
                        {deleting === event._id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Statistics Modal */}
      <Modal show={showStatsModal} onHide={() => setShowStatsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Event Statistics - {selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {stats && (
            <Row className="g-3">
              <Col md={6}>
                <div className="stats-card">
                  <h3>{stats.registeredCount}</h3>
                  <p>Registered</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="stats-card">
                  <h3>{stats.cancelledCount}</h3>
                  <p>Cancelled</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="stats-card">
                  <h3>{stats.attendedCount}</h3>
                  <p>Attended</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="stats-card">
                  <h3>{stats.capacityFilled}%</h3>
                  <p>Capacity Filled</p>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>

      {/* Registrations Modal */}
      <Modal show={showRegistrationsModal} onHide={() => setShowRegistrationsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registered Students - {selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {registrations.length === 0 ? (
            <p>No students registered yet</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Enrollment Number</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration._id}>
                      <td>{registration.student?.name}</td>
                      <td>{registration.student?.email}</td>
                      <td>{registration.student?.enrollmentNumber || 'N/A'}</td>
                      <td>{registration.student?.department || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;
