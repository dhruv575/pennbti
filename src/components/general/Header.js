import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  height: 80px;
  @media (max-width: 768px) {
    height: ${props => props.isOpen ? '300px' : '70px'};
  }
`;

const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem 10%;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem 1rem;
    align-items: flex-start;
    ${props => props.isOpen && `
      height: auto;
      padding-bottom: 1rem;
    `}
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 0.5rem;
    display: ${props => props.isOpen ? 'flex' : 'none'};
    padding: 0 0.5rem;
  }
`;

const Logo = styled.img`
  height: 50px;
  width: auto;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const SignalLogo = styled.img`
  height: 35px;
  width: auto;
  margin-left: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Button = styled(Link)`
  padding: 0.7rem 1.2rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 0.25rem 0;
    box-sizing: border-box;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 1.5rem;
  color: #007bff;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('userToken');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderWrapper isOpen={isOpen}>
      <HeaderContainer isOpen={isOpen}>
        <LeftSection>
          <Link to="/">
            <Logo src="/logo512.png" alt="Logo" />
          </Link>
        </LeftSection>
        
        <MenuButton onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </MenuButton>

        <RightSection isOpen={isOpen}>
          <Button to="/roomLogin" onClick={() => setIsOpen(false)}>Room Setup</Button>
          {isLoggedIn ? (
            <Button to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Button>
          ) : (
            <Button to="/userLogin" onClick={() => setIsOpen(false)}>User Login</Button>
          )}
          <a 
            href="https://the-signal.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
          >
            <SignalLogo src="/signal.png" alt="Signal" />
          </a>
        </RightSection>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header; 