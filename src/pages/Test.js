import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import questions from '../assets/questions.json';
import { API_URL } from '../config';

const Container = styled.div`
  padding: 5% 10%;
  min-height: 100vh;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    padding: 5%;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const Progress = styled.div`
  width: ${props => props.percent}%;
  height: 100%;
  background-color: #007bff;
  border-radius: 10px;
  transition: width 0.3s ease;
`;

const QuestionContainer = styled.div`
  background: white;
  padding: 2rem 6rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-evenly;
  position: relative;
  padding: 0 0 2.5rem 0;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0 0 1.5rem 0;
  }
`;

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnswerButton = styled.button`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
  
  ${props => {
    if (props.value === 3) {
      return `
        border: 2px solid #6c757d;
        ${props.selected && 'background-color: #6c757d;'}
      `;
    }
    if (props.value > 3) {
      const color = props.value === 5 ? '#28a745' : '#5cb85c';
      return `
        border: 2px solid ${color};
        ${props.selected && `background-color: ${color};`}
      `;
    }
    const color = props.value === 1 ? '#dc3545' : '#ff6b6b';
    return `
      border: 2px solid ${color};
      ${props.selected && `background-color: ${color};`}
    `;
  }}
  
  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    border-width: 1px;
  }
`;

const ButtonLabel = styled.span`
  position: absolute;
  bottom: 0;
  ${props => props.align === 'left' ? 'left: 5%;' : 'right: 5%;'}
  font-size: 0.9rem;
  color: #666;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    ${props => props.align === 'left' ? 'left: 0;' : 'right: 0;'}
  }
`;

const NavigationButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const NavigationButton = styled.button`
  padding: 1rem 3rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    width: 100%;
  }
`;

const Question = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const QuestionText = styled.p`
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
`;

const Test = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/userLogin');
    }
    
    // Randomize all questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffled);
  }, [navigate]);

  const handleAnswer = (questionIndex, value) => {
    const question = randomizedQuestions[currentSection * 10 + questionIndex];
    
    setAnswers(prev => ({
      ...prev,
      [question.text]: { value, code: question.code }
    }));
  };

  const isCurrentSectionComplete = () => {
    const sectionQuestions = randomizedQuestions.slice(
      currentSection * 10,
      (currentSection + 1) * 10
    );
    
    return sectionQuestions.every(question => 
      answers[question.text] !== undefined
    );
  };

  const calculateMBTI = async () => {
    // Group answers by code
    const answersByCode = {
      "1": [],
      "2": [],
      "3": [],
      "4": []
    };
    
    Object.values(answers).forEach(answer => {
      answersByCode[answer.code].push(answer.value);
    });
    
    console.log('Answers grouped by code:', answersByCode);
    
    // Calculate averages for each code group
    const averages = [
      calculateAverage(answersByCode["1"]), // E vs I
      calculateAverage(answersByCode["2"]), // S vs N
      calculateAverage(answersByCode["3"]), // T vs F
      calculateAverage(answersByCode["4"])  // J vs P
    ];
    
    console.log('Calculated averages:', averages);

    // Fix: Reverse the logic for determining MBTI type
    // For each dimension, if average is > 3, use the second letter
    const mbti = [
      averages[0] > 3 ? 'I' : 'E',
      averages[1] > 3 ? 'N' : 'S',
      averages[2] > 3 ? 'F' : 'T',
      averages[3] > 3 ? 'P' : 'J'
    ].join('');

    try {
      console.log('Sending to backend:', { mbti, scores: averages });
      
      const response = await fetch(`${API_URL}/api/users/mbti`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({ 
          mbti,
          scores: averages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update MBTI');
      }
      
      const responseData = await response.json();
      console.log('Backend response:', responseData);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating MBTI:', error);
    }
  };
  
  const calculateAverage = (array) => {
    if (array.length === 0) return 0;
    const sum = array.reduce((a, b) => a + b, 0);
    return parseFloat((sum / array.length).toFixed(2));
  };

  const handleNext = () => {
    if (currentSection < 3) {
      window.scrollTo(0, 0);
      setCurrentSection(currentSection + 1);
    } else {
      calculateMBTI();
    }
  };

  const currentQuestions = randomizedQuestions.slice(
    currentSection * 10,
    (currentSection + 1) * 10
  );

  return (
    <Container>
      <ProgressBar>
        <Progress percent={(currentSection + 1) * 25} />
      </ProgressBar>

      <QuestionContainer>
        {currentQuestions.map((question, index) => (
          <Question key={index}>
            <QuestionText>{question.text}</QuestionText>
            <ButtonGroup>
              <ButtonLabel align="left">Disagree</ButtonLabel>
              {[1, 2, 3, 4, 5].map((value) => (
                <ButtonContainer key={value}>
                  <AnswerButton
                    value={value}
                    selected={answers[question.text]?.value === value}
                    onClick={() => handleAnswer(index, value)}
                  />
                </ButtonContainer>
              ))}
              <ButtonLabel align="right">Agree</ButtonLabel>
            </ButtonGroup>
          </Question>
        ))}
      </QuestionContainer>

      <NavigationButtonContainer>
        <NavigationButton
          onClick={handleNext}
          disabled={!isCurrentSectionComplete()}
        >
          {currentSection === 3 ? 'Submit' : 'Next'}
        </NavigationButton>
      </NavigationButtonContainer>
    </Container>
  );
};

export default Test; 