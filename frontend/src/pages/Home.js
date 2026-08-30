import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <div className="hero-section">
        <Container>
          <h1>Campus Event Management System</h1>
          <p>Discover, register, and manage campus events all in one place</p>
          <div>
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-light btn-lg me-3">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link to="/events" className="btn btn-light btn-lg me-3">
                  Browse Events
                </Link>
                {user?.role === 'student' && (
                  <Link to="/my-registrations" className="btn btn-outline-light btn-lg">
                    My Registrations
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-outline-light btn-lg">
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="mb-5">
          <Col md={4} className="text-center mb-4">
            <h3>📅 Explore Events</h3>
            <p>Browse and search for campus events in various categories like technical, cultural, sports, and academic.</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <h3>✅ Easy Registration</h3>
            <p>Register for events with just a few clicks. Manage your registrations and receive updates about events.</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <h3>📊 Track Statistics</h3>
            <p>Admins can create events, track registrations, view statistics, and manage student data efficiently.</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h2 className="text-center mb-4">Features</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Student Features:</strong> Register/Login, View and search events, Register for events, Manage registrations
              </li>
              <li className="list-group-item">
                <strong>Admin Features:</strong> Create and manage events, View registered students, Track event statistics
              </li>
              <li className="list-group-item">
                <strong>Security:</strong> JWT authentication, Role-based authorization, Secure password hashing
              </li>
              <li className="list-group-item">
                <strong>Database:</strong> MongoDB with Mongoose, Event relationships, Advanced search and filtering
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
