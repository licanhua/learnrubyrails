import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AboutPage } from './Pages/AboutPage';
import { HomePage } from './Pages/HomePage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { Container, Navbar } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <>
      <Container>
        <Navbar expand='lg' variant='light' bg='light'>
          <Container>
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/about">About</Link>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
