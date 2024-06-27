import React, { useRef, useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup} from "firebase/auth";


import './Signup.css';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();
 
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const linkStyle={
    textDecoration: 'none',color: isHovered ? 'black' : '#92e3a9',
  }
  

const provider = new GoogleAuthProvider();

  useEffect(() => {
    document.body.className = 'Signup';
  }, []);

  const auth = getAuth();
  const googleSignup = async () => {
    try {
      
    provider.addScope('email');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userName = user.displayName;
      const userEmail = user.email;
      const emailDomain = userEmail.split('@')[1];
      console.log('User Name:', userName);
      if (emailDomain === 'vishnu.edu.in') {
        await navigate('/vishnudashboard', { state: { userName, userEmail } });
      } else {
        await navigate('/dashboard', { state: { userName, userEmail } });
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Google Sign In Error:', errorCode, errorMessage);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      const { user } = await signup(emailRef.current.value, passwordRef.current.value);
      const db = getFirestore();

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: nameRef.current.value,
        email: emailRef.current.value,
      });

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <>
      <Card style={{ backgroundColor: 'rgba(255, 255, 255,0.2)', boxShadow: '1px 16px 186px -44px rgba(0,0,0,0.7)', borderRadius: '26px', color: "#162734" }}>
        <Card.Body>
          <h2 className='text-center mb-2'>Sign Up</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="name" style={{ marginBottom: "15px" }}>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" ref={nameRef} required className='input' style={{backgroundColor:'rgba(255,255,255,0.5)',color:'#969997'}} />
            </Form.Group>

            <Form.Group id="email" style={{ marginBottom: "15px" }}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required className='input' style={{backgroundColor:'rgba(255,255,255,0.5)',color:'#969997'}} />
            </Form.Group>

            <Form.Group id="password" style={{ marginBottom: "15px" }}>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required className='input'  style={{backgroundColor:'rgba(255,255,255,0.5)',color:'#969997'}} />
            </Form.Group>
            <Form.Group id="password-confirm" style={{ marginBottom: "15px" }}>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required className='input' style={{backgroundColor:'rgba(255,255,255,0.5)',color:'#969997'}} />
            </Form.Group>

            <Button disabled={loading} className="w-100 button" type="submit" style={{backgroundColor:'#253439',border:'0',fontSize:'16px',color:'#dff7e7' }}>
              Sign Up
            </Button>
            <p style={{textAlign:'center',paddingTop:'1rem'}}> OR</p>
            <Button disabled={loading} onClick={googleSignup} className="w-100 button" type="button" style={{backgroundColor:'#253439',border:'0',fontSize:'16px',color:'#dff7e7' }}>
              Sign Up with Google
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
      <div className="w-100 text-center mt-2" style={{ color: 'rgba(0,2,35,255)' }}>
        Already have an account? <Link to="/login" style={linkStyle}  onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}>Login</Link>
      </div>
    </>
  );
}
