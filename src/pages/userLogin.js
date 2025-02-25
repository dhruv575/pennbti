import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: ${props => props.active ? '#007bff' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#007bff' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #007bff;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const UserLogin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    preference: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            // User is already logged in, redirect to dashboard
            navigate('/dashboard');
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('userToken');
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          localStorage.removeItem('userToken');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('userToken', data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Automatically log in after successful signup
      const loginResponse = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const loginData = await loginResponse.json();
      localStorage.setItem('userToken', loginData.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <TabContainer>
        <Tab 
          active={activeTab === 'login'} 
          onClick={() => setActiveTab('login')}
        >
          Login
        </Tab>
        <Tab 
          active={activeTab === 'signup'} 
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </Tab>
      </TabContainer>

      {activeTab === 'login' ? (
        <Form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Penn Email"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
          />
          <Input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
          />
          <Button type="submit">Login</Button>
        </Form>
      ) : (
        <Form onSubmit={handleSignup}>
          <Input
            type="text"
            placeholder="Name"
            value={signupData.name}
            onChange={(e) => setSignupData({...signupData, name: e.target.value})}
          />
          <Input
            type="email"
            placeholder="Penn Email"
            value={signupData.email}
            onChange={(e) => setSignupData({...signupData, email: e.target.value})}
          />
          <Input
            type="password"
            placeholder="Password"
            value={signupData.password}
            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
          />
          <Select
            value={signupData.gender}
            onChange={(e) => setSignupData({...signupData, gender: e.target.value})}
          >
            <option value="">Your Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
          <Select
            value={signupData.preference}
            onChange={(e) => setSignupData({...signupData, preference: e.target.value})}
          >
            <option value="">Match Preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="any">Any</option>
          </Select>
          <Button type="submit">Sign Up</Button>
        </Form>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default UserLogin;
