import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    enrollmentNumber: '',
    department: '',
    semester: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      enrollmentNumber: formData.enrollmentNumber,
      department: formData.department,
      semester: formData.semester
    });

    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <Container className="form-container">
      <h2>Register</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email Address *</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Account Type *</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
          </Form.Select>
          <Form.Text className="text-muted">
            Organizers can create and manage their own events.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Enrollment Number</Form.Label>
          <Form.Control
            type="text"
            name="enrollmentNumber"
            value={formData.enrollmentNumber}
            onChange={handleChange}
            placeholder="e.g., BCA-2024-001"
          />
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

        <Form.Group className="mb-3">
          <Form.Label>Semester</Form.Label>
          <Form.Select
            name="semester"
            value={formData.semester}
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

        <Form.Group className="mb-3">
          <Form.Label>Password *</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password (min 6 characters)"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password *</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mb-3"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>

      <p className="text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-decoration-none">
          Login here
        </Link>
      </p>
    </Container>
  );
}

export default Register;
