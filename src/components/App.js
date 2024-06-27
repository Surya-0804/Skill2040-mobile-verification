import React from 'react';
import Signup from './Signup';
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import VishnuDashboard from './VishnuDashboard';
import VerifyNumber from "./VerifyNumber.js";



function App() {
  return (
   
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vishnudashboard"
                element={
                  <PrivateRoute>
                    <VishnuDashboard />
                  </PrivateRoute>
                }
              />
              <Route exact path="/" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/verifynumber" element={<VerifyNumber/>}/>
              <Route path="/login" element={<Login />} />
              
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
    
  );
}

export default App;
