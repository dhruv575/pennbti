import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 20px auto;
    gap: 20px;
    padding: 0 10px;
  }
`;

const UserInfoBox = styled.div`
  width: 33%;
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;

  @media (max-width: 768px) {
    width: auto;
    padding: 20px;
  }
`;

const ContentSection = styled.div`
  width: 67%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const AddRoomBox = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MatchesBox = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(0, 123, 255, 0.1);

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

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Title = styled.h2`
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  position: relative;
  padding-bottom: 10px;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: #007bff;
    border-radius: 2px;
  }
`;

const InfoItem = styled.div`
  margin: 15px 0;
  font-size: 1rem;
  color: #666;

  strong {
    color: #333;
    margin-right: 8px;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background: #0056b3;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TestButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
`;

const MatchList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MatchItem = styled.li`
  padding: 15px;
  margin: 10px 0;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 10px;
  font-size: 1rem;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(0, 123, 255, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MatchName = styled.span`
  font-weight: 600;
  color: #007bff;
`;

const RoomName = styled.span`
  font-weight: 500;
  color: #28a745;
`;

const EmailText = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/userLogin');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/userLogin');
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle room joining
  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('userToken');

    try {
      // Verify room exists
      const roomResponse = await fetch(`http://localhost:5000/api/rooms/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: roomCode })
      });

      if (!roomResponse.ok) throw new Error('Room not found');

      const { roomId } = await roomResponse.json();

      // Add user to room
      const addResponse = await fetch('http://localhost:5000/api/rooms/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomId })
      });

      if (!addResponse.ok) {
        const errorData = await addResponse.json();
        throw new Error(errorData.message || 'Failed to join room');
      }

      // Refresh user data
      const userResponse = await fetch('http://localhost:5000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      setRoomCode('');
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem('userToken');
      if (!token || !user) return;

      try {
        const response = await fetch('http://localhost:5000/api/users/matches', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const matchesData = await response.json();
          setMatches(matchesData);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [user]);

  return (
    <DashboardContainer>
      <UserInfoBox>
        <Title>User Profile</Title>
        {user && (
          <>
            <InfoItem>
              <strong>Name:</strong> {user.name}
            </InfoItem>
            <InfoItem>
              <strong>Email:</strong> {user.email}
            </InfoItem>
            <InfoItem>
              <strong>MBTI:</strong> {user.mbti || 'Not set'}
            </InfoItem>
            <TestButton onClick={() => navigate('/test')}>
              {user.mbti ? 'Retake Test' : 'Take Test'}
            </TestButton>
          </>
        )}
      </UserInfoBox>

      <ContentSection>
        <AddRoomBox>
          <Title>Join a Room</Title>
          <Form onSubmit={handleAddRoom}>
            <Input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
            />
            <Button type="submit">Join Room</Button>
          </Form>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </AddRoomBox>

        <MatchesBox>
          <Title>Your Rooms</Title>
          {user?.rooms?.length > 0 ? (
            <MatchList>
              {user.rooms.map((room) => (
                <MatchItem key={room._id}>
                  {room.name} ({room.code})
                </MatchItem>
              ))}
            </MatchList>
          ) : (
            <InfoItem>You haven't joined any rooms yet.</InfoItem>
          )}
        </MatchesBox>

        <MatchesBox>
          <Title>Your Matches</Title>
          {matches?.length > 0 ? (
            <MatchList>
              {matches.map((match) => (
                <MatchItem key={match._id}>
                  Matched with <MatchName>{match.matchedUser?.name}</MatchName>{' '}
                  (<EmailText>{match.matchedUser?.email}</EmailText>) in room{' '}
                  <RoomName>{match.room?.name}</RoomName>
                </MatchItem>
              ))}
            </MatchList>
          ) : (
            <InfoItem>No matches found yet.</InfoItem>
          )}
        </MatchesBox>
      </ContentSection>
    </DashboardContainer>
  );
};

export default Dashboard;