import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    date: '',
    time: '',
    location: '',
    capacity: '',
    registrationDeadline: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await eventAPI.createEvent(eventData);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="form-container">
      <h2>Create New Event</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Event Title *</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category *</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="technical">Technical</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="academic">Academic</option>
            <option value="other">Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Date *</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Time *</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location *</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Capacity *</Form.Label>
          <Form.Control
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Enter maximum number of students"
            min="1"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Registration Deadline *</Form.Label>
          <Form.Control
            type="date"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., coding, web development, beginner-friendly"
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button
            variant="primary"
            type="submit"
            className="flex-grow-1"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CreateEvent;
