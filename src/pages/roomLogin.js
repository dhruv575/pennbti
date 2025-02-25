import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from '../config';

// Reusing styles from userLogin.js
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

const RoomLogin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');

  // Create room form state
  const [createData, setCreateData] = useState({
    name: '',
    code: '',
    password: '',
    type: '',
    verificationCode: ''
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    code: '',
    password: ''
  });

  const validateCode = (code) => {
    const codeRegex = /^[a-zA-Z0-9]{1,8}$/;
    return codeRegex.test(code);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (createData.verificationCode !== 'S!gn4L') {
      setError('Invalid verification code');
      return;
    }

    if (!validateCode(createData.code)) {
      setError('Code must be max 8 characters, letters and numbers only');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createData.name,
          code: createData.code,
          password: createData.password,
          type: createData.type
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create room');
      }

      // Store room-specific credentials
      localStorage.setItem(`room_${createData.code}`, JSON.stringify({
        code: createData.code,
        password: createData.password
      }));

      navigate(`/room/${createData.code}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/rooms/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store room-specific credentials
      localStorage.setItem(`room_${loginData.code}`, JSON.stringify({
        code: loginData.code,
        password: loginData.password
      }));

      navigate(`/room/${loginData.code}`);
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
          Room Login
        </Tab>
        <Tab 
          active={activeTab === 'create'} 
          onClick={() => setActiveTab('create')}
        >
          Create Room
        </Tab>
      </TabContainer>

      {activeTab === 'login' ? (
        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Room Code"
            value={loginData.code}
            onChange={(e) => setLoginData({...loginData, code: e.target.value.toLowerCase()})}
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
        <Form onSubmit={handleCreate}>
          <Input
            type="text"
            placeholder="Room Name"
            value={createData.name}
            onChange={(e) => setCreateData({...createData, name: e.target.value})}
          />
          <Input
            type="text"
            placeholder="Room Code (max 8 characters, lowercase)"
            value={createData.code}
            onChange={(e) => setCreateData({...createData, code: e.target.value.toLowerCase()})}
          />
          <Input
            type="password"
            placeholder="Password"
            value={createData.password}
            onChange={(e) => setCreateData({...createData, password: e.target.value})}
          />
          <Select
            value={createData.type}
            onChange={(e) => setCreateData({...createData, type: e.target.value})}
          >
            <option value="">Select Room Type</option>
            <option value="romantic">Romantic</option>
            <option value="platonic">Platonic</option>
          </Select>
          <Input
            type="password"
            placeholder="Verification Code"
            value={createData.verificationCode}
            onChange={(e) => setCreateData({...createData, verificationCode: e.target.value})}
          />
          <p>Verification Code: S!gn4L</p>
          <Button type="submit">Create Room</Button>
        </Form>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default RoomLogin;
