import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    semester: '',
    enrollmentNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        semester: user.semester || '',
        enrollmentNumber: user.enrollmentNumber || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      await userAPI.updateProfile({
        name: formData.name,
        department: formData.department,
        semester: formData.semester
      });
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
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
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">My Profile</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-light"
                  />
                  <small className="text-muted">Email cannot be changed</small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Enrollment Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber}
                    disabled
                    className="bg-light"
                  />
                  <small className="text-muted">Enrollment number cannot be changed</small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    name="semester"
                    value={formData.semester || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="flex-grow-1"
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mt-4 shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">Account Information</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Role:</strong>
                  <p className="text-capitalize">{user?.role || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <strong>Account Created:</strong>
                  <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
