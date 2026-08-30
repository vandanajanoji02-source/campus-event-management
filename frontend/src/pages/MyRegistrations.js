import React, { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Tab,
  Tabs
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { registrationAPI } from '../services/api';

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationAPI.getMyRegistrations();
      setRegistrations(response.data.registrations || []);
      setError('');
    } catch (err) {
      setError('Failed to load registrations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (registration) => {
    setSelectedRegistration(registration);
    setCancellationReason('');
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRegistration) return;

    try {
      setCancelling(true);
      await registrationAPI.cancelRegistration(
        selectedRegistration._id,
        cancellationReason
      );
      setSuccess('Registration cancelled successfully');
      setShowCancelModal(false);
      setTimeout(() => setSuccess(''), 3000);
      fetchMyRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      registered: 'success',
      cancelled: 'secondary',
      attended: 'primary',
      'no-show': 'warning'
    };
    return colors[status] || 'secondary';
  };

  const getStatusLabel = (status) => {
    const labels = {
      registered: 'Registered',
      cancelled: 'Cancelled',
      attended: 'Attended',
      'no-show': 'No Show'
    };
    return labels[status] || status;
  };

  const getFilteredRegistrations = () => {
    if (activeTab === 'all') return registrations;
    return registrations.filter((registration) => registration.status === activeTab);
  };

  const getStatusCount = (status) => {
    if (status === 'all') return registrations.length;
    return registrations.filter((registration) => registration.status === status).length;
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

  const filteredRegistrations = getFilteredRegistrations();

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Registrations</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {registrations.length === 0 ? (
        <div className="no-results">
          <h3>No registrations yet</h3>
          <p>Start by exploring and registering for events</p>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          <Tabs
            id="registration-tabs"
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab || 'all')}
            className="mb-4"
          >
            <Tab eventKey="all" title={`All (${getStatusCount('all')})`} />
            <Tab eventKey="registered" title={`Active (${getStatusCount('registered')})`} />
            <Tab eventKey="attended" title={`Attended (${getStatusCount('attended')})`} />
            <Tab eventKey="cancelled" title={`Cancelled (${getStatusCount('cancelled')})`} />
          </Tabs>

          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No registrations found in this category.</p>
            </div>
          ) : (
            <Row className="g-4">
              {filteredRegistrations.map((registration) => (
                <Col md={6} lg={4} key={registration._id}>
                  <Card className="event-card h-100">
                    <Card.Body>
                      <div className="mb-3">
                        <Badge bg={getStatusColor(registration.status)}>
                          {getStatusLabel(registration.status)}
                        </Badge>
                      </div>

                      <Card.Title>{registration.event?.title}</Card.Title>
                      <Card.Text className="text-muted small mb-3">
                        {registration.event?.description?.substring(0, 60)}...
                      </Card.Text>

                      <div className="mb-3">
                        <small className="d-block mb-1">
                          Date: {new Date(registration.event?.date).toLocaleDateString('en-IN')} at {registration.event?.time}
                        </small>
                        <small className="d-block mb-1">
                          Location: {registration.event?.location}
                        </small>
                        <small className="d-block">
                          Registered on: {new Date(registration.registeredAt).toLocaleDateString('en-IN')}
                        </small>
                        {registration.cancelledAt && (
                          <small className="d-block text-danger mt-1">
                            Cancelled on: {new Date(registration.cancelledAt).toLocaleDateString('en-IN')}
                            {registration.cancellationReason && (
                              <span className="d-block">
                                Reason: {registration.cancellationReason}
                              </span>
                            )}
                          </small>
                        )}
                      </div>

                      <div className="d-flex gap-2">
                        <Link
                          to={`/events/${registration.event?._id}`}
                          className="btn btn-sm btn-outline-primary flex-grow-1"
                        >
                          View Event
                        </Link>
                        {registration.status === 'registered' && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancelClick(registration)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to cancel your registration for{' '}
            <strong>{selectedRegistration?.event?.title}</strong>?
          </p>
          <Form.Group>
            <Form.Label>Reason for cancellation (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancellationReason}
              onChange={(event) => setCancellationReason(event.target.value)}
              placeholder="Please tell us why you are cancelling..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Registration
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyRegistrations;
