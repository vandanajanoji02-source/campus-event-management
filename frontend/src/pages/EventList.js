import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';

function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, search, category, sortBy]);

  const fetchEvents = async () => {
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

  const filterAndSortEvents = () => {
    let filtered = events;

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((event) => event.category === category);
    }

    // Sort
    if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.registrationCount - a.registrationCount);
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredEvents(filtered);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setSortBy('date');
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Campus Events</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="filter-section">
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="mb-2">Search Events</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="mb-2">Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="technical">Technical</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="academic">Academic</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="mb-2">Sort By</Form.Label>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="popularity">Popularity</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="text-end">
          <Button variant="outline-secondary" onClick={handleResetFilters} size="sm">
            Reset Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="no-results">
          <h3>No events found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <Row className="g-4">
          {filteredEvents.map((event) => (
            <Col key={event._id} md={6} lg={4}>
              <EventCard event={event} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default EventList;
