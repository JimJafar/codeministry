import * as React  from 'react';
import './Home.css';
import {Card, Col, Container, Row} from 'react-bootstrap'

const Home = () => (
    <div className="home-page" data-testid="home-page">
      <h1>The Palo MERN starter</h1>

      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Server</Card.Title>
                <ul>
                  <li>node</li>
                  <li>typescript</li>
                  <li>expressjs</li>
                  <li>jest & supertest</li>
                  <li>eslint</li>
                  <li>prettier</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Client</Card.Title>
                <ul>
                  <li>React 17</li>
                  <li>typescript</li>
                  <li>Bootstrap</li>
                  <li>jest</li>
                  <li>eslint</li>
                  <li>prettier</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
);

export default Home;
