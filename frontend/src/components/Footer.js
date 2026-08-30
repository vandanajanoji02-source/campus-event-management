import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>Campus Event Management</h5>
            <p>A complete event management system for campus activities.</p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/events" className="text-light text-decoration-none">Events</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Contact</h5>
            <p>Email: info@campusevents.com</p>
            <p>Phone: +91-XXXXXXXXXX</p>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row>
          <Col className="text-center">
            <p>&copy; {currentYear} Campus Event Management System. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
