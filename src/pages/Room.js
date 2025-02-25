import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from '../config';

// Reference Dashboard.js styling
const Container = styled.div`
  min-height: 100vh;
  padding: 10%;
  background-color: #f5f5f5;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 5%;
    gap: 1rem;
  }
`;

const Box = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const RoomInfoBox = styled(Box)`
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  height: fit-content;

  @media (max-width: 768px) {
    grid-row: span 1;
  }
`;

const ScrollBox = styled(Box)`
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
  
  label {
    font-weight: 600;
    color: #666;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  span {
    color: #333;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserItem = styled.div`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }
  
  p {
    margin: 0.25rem 0 0 0;
    font-size: 0.9rem;
    color: #666;
  }
`;

const MatchItem = styled(UserItem)`
  background-color: ${props => props.active ? '#f8f9fa' : '#e9ecef'};
`;

// Add error display
const ErrorMessage = styled.div`
  color: red;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const Room = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const fetchRoomData = useCallback(async () => {
    const roomAuth = localStorage.getItem(`room_${code}`);
    if (!roomAuth) {
      navigate('/roomLogin');
      return;
    }

    const { password } = JSON.parse(roomAuth);

    try {
      const response = await fetch(`${API_URL}/api/rooms/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'code': code,
          'password': password
        }
      });

      if (response.status === 401) {
        localStorage.removeItem(`room_${code}`);
        navigate('/roomLogin');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch room data');
      }
      
      const data = await response.json();
      setRoom(data.room);
      setUsers(data.users);
      setMatches(data.matches || []);
    } catch (error) {
      setError(error.message);
    }
  }, [code, navigate]);

  const handleCreateMatches = async () => {
    const roomAuth = localStorage.getItem(`room_${code}`);
    if (!roomAuth) {
      navigate('/roomLogin');
      return;
    }

    const { password } = JSON.parse(roomAuth);

    try {
      const response = await fetch(`${API_URL}/api/rooms/${code}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'code': code,
          'password': password
        }
      });

      if (response.status === 401) {
        localStorage.removeItem(`room_${code}`);
        navigate('/roomLogin');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to create matches');
      }
      
      const data = await response.json();
      setRoom(data.room);
      setMatches(data.matches);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  if (!room) {
    return (
      <Container>
        {error ? <ErrorMessage>{error}</ErrorMessage> : <div>Loading...</div>}
      </Container>
    );
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <RoomInfoBox>
        <Title>Room Information</Title>
        <InfoItem>
          <label>Name:</label>
          <span>{room.name}</span>
        </InfoItem>
        <InfoItem>
          <label>Code:</label>
          <span>{room.code}</span>
        </InfoItem>
        <InfoItem>
          <label>Type:</label>
          <span>{room.type}</span>
        </InfoItem>
        <InfoItem>
          <label>Status:</label>
          <span>{room.active ? 'Active' : 'Inactive'}</span>
        </InfoItem>
        <InfoItem>
          <label>Submissions:</label>
          <span>{users.length}</span>
        </InfoItem>
        {room.active && (
          <Button 
            onClick={handleCreateMatches}
            disabled={users.length < 2}
          >
            Create Matches
          </Button>
        )}
      </RoomInfoBox>

      <ScrollBox>
        <Title>Users ({users.length})</Title>
        <UserList>
          {users.map(user => (
            <UserItem key={user._id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </UserItem>
          ))}
        </UserList>
      </ScrollBox>

      <ScrollBox>
        <Title>Matches</Title>
        <UserList>
          {matches.map((match, index) => (
            <MatchItem key={index} active={room.active}>
              <h3>{match.user1.name} & {match.user2.name}</h3>
              <p>{match.user1.email} | {match.user2.email}</p>
            </MatchItem>
          ))}
          {matches.length === 0 && <p>No matches yet</p>}
        </UserList>
      </ScrollBox>
    </Container>
  );
};

export default Room; 