import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    height: 60px;
    padding: 0 15px;
    position: relative;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 50px;
  width: auto;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    padding: 20px;
    gap: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    align-items: center;
    justify-content: flex-start;
    max-height: auto;
  }
`;

const Button = styled(Link)`
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: center;
  
  ${({ primary }) => primary ? `
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  ` : `
    background: transparent;
    color: #007bff;
    
    &:hover {
      background: #f8f9fa;
    }
  `}

  @media (max-width: 768px) {
    padding: 12px 20px;
    width: 90%;
    max-width: 300px;
    border: 1px solid ${({ primary }) => primary ? '#007bff' : '#dee2e6'};
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  color: #333;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const SignalLogo = styled.img`
  height: 30px;
  width: auto;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    height: 25px;
  }
`;

const SignalLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('header')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <HeaderWrapper isOpen={isOpen}>
      <HeaderContainer>
        <LeftSection>
          <Link to="/" onClick={() => setIsOpen(false)}>
            <Logo src="/logo512.png" alt="PennBTI" />
          </Link>
        </LeftSection>
        
        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? '✕' : '☰'}
        </MenuButton>

        <RightSection isOpen={isOpen}>
          <Button to="/roomLogin" onClick={() => setIsOpen(false)}>
            Room Setup
          </Button>
          {isLoggedIn ? (
            <Button to="/dashboard" primary onClick={() => setIsOpen(false)}>
              Dashboard
            </Button>
          ) : (
            <Button to="/userLogin" primary onClick={() => setIsOpen(false)}>
              User Login
            </Button>
          )}
          <SignalLink 
            href="https://the-signal.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
          >
            <SignalLogo src="/signal.png" alt="Signal" />
          </SignalLink>
        </RightSection>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header; 