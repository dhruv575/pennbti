import React from 'react';
import styled from 'styled-components';

const LandingContainer = styled.div`
  height: calc(100vh - 80px); // Adjust based on your header height
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 20px;
    gap: 20px;
  }
`;

const MBTISection = styled.div`
  width: 33%;
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 123, 255, 0.1);
  overflow-y: auto;

  @media (max-width: 768px) {
    width: auto;
  }

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

const ContentSection = styled.div`
  width: 67%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const InfoBox = styled.div`
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 123, 255, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

const CategoryTitle = styled.h3`
  color: #007bff;
  margin: 20px 0 10px 0;
  font-size: 1.2rem;
`;

const Text = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 10px 0;
`;

const Landing = () => {
  return (
    <LandingContainer>
      <MBTISection>
        <Title>Understanding MBTI</Title>
        
        <CategoryTitle>Extraversion (E) vs. Introversion (I)</CategoryTitle>
        <Text>
          This dimension focuses on where you direct your energy and attention.
          Extraverts are energized by social interaction, while Introverts recharge through solitude.
        </Text>

        <CategoryTitle>Sensing (S) vs. Intuition (N)</CategoryTitle>
        <Text>
          This describes how you prefer to take in information. Sensing types focus on concrete facts
          and details, while Intuitive types prefer abstract concepts and patterns.
        </Text>

        <CategoryTitle>Thinking (T) vs. Feeling (F)</CategoryTitle>
        <Text>
          This reflects how you make decisions. Thinking types prioritize logic and consistency,
          while Feeling types emphasize personal values and harmony.
        </Text>

        <CategoryTitle>Judging (J) vs. Perceiving (P)</CategoryTitle>
        <Text>
          This shows how you approach the outer world. Judging types prefer structure and planning,
          while Perceiving types favor flexibility and spontaneity.
        </Text>
      </MBTISection>

      <ContentSection>
        <InfoBox>
          <Title>How It Works</Title>
          <Text>
            Anyone can create a "room" (could be a group, a club, a team, etc.) and invite people to join.
            Users can then take a MBTI test once and join as many rooms as they want.
            The room's creator can then make matches (either romantic or platonic) at any time, based on MBTI compatibility.
          </Text>
        </InfoBox>

        <InfoBox>
          <Title>Goals</Title>
          <Text>
            Make new friends, find a romantic partner, or just have a good time. Penn Marriage Pact only runs once an year and includes the whole school, with MBTI match, you can do better.
            Plus, we hope people enjoy filling our our silly little questions!
          </Text>
        </InfoBox>

        <InfoBox>
          <Title>The Signal</Title>
          <Text>
            If you like this project, you should check out some of the other work we do at <a href="https://the-signal.vercel.app/" target="_blank" rel="noopener noreferrer">The Signal</a>.
            We promise you it'll be worth your time.
          </Text>
        </InfoBox>
      </ContentSection>
    </LandingContainer>
  );
};

export default Landing;
