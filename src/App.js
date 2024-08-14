import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Notes from './Notes';
import Calendar from './Calendar';
import Themes from './Themes';
import logo from './assets/Maiz.png';  // Import the logo

// Global styles including font import
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #181818;  // Dark background for the entire application
    color: #fff;  // White text color
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background: rgba(30, 30, 30, 0.9);  // Dark background for the sidebar
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  color: #fff;  // White text color
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;  // Center horizontally
  justify-content: flex-start;  // Start from the top
`;

const Logo = styled.img`
  width: 150px;  // Adjust size as needed
  margin-bottom: 20px;
  align-self: flex-start;  // Align the logo to the top left
`;

const NavContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;  // Center vertically
  align-items: center;  // Center horizontally
  width: 100%;
`;

const NavList = styled.ul`
  list-style: none;  // Remove dots
  padding: 0;
  margin: 0;
  width: 100%;  // Make sure list takes full width
`;

const NavItem = styled.li`
  margin: 20px 0;  // Increase space between items
  opacity: ${(props) => (props.active ? 1 : 0.6)};  // Full opacity if active
  transition: opacity 0.3s ease-in-out, transform 0.3s, font-size 0.3s;
  font-size: ${(props) => (props.active ? '1.2em' : '1em')};  // Increase font size if active
  transform: ${(props) => (props.active ? 'scale(1.1)' : 'scale(1)')};  // Slightly increase size if active
  
  &:hover {
    opacity: 1;  // Full opacity on hover
    cursor: pointer;
  }
`;

const NavLink = styled.div`
  padding: 25px 20px;  // Increase clickable area
  display: inline-block;
  width: 100%;  // Make the link fill the entire list item width
  text-align: center;  // Center text horizontally
  position: relative;
  
  ${(props) =>
    props.active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 120%;
      height: 120%;
      background: rgba(255, 255, 255, 0.34);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(6.2px);
      -webkit-backdrop-filter: blur(6.2px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      z-index: -1;
    }
  `}
`;

const Container = styled.div`
  display: flex;
  background-color: #181818;  // Dark background for the entire application
  min-height: 100vh;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #282828;  // Slightly lighter dark background for content area
  color: #fff;  // White text color
`;

const App = () => {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'notes':
        return <Notes />;
      case 'calendar':
        return <Calendar />;
      case 'themes':
        return <Themes />;
      default:
        return <h1>Welcome to Maiz</h1>;
    }
  };

  return (
    <>
      <GlobalStyle />  {/* Apply global styles */}
      <Container>
        <Sidebar>
          <Logo src={logo} alt="Maiz Logo" />
          <NavContainer>
            <nav>
              <NavList>
                <NavItem active={activePage === 'home'} onClick={() => setActivePage('home')}>
                  <NavLink active={activePage === 'home'}>Homepage</NavLink>
                </NavItem>
                <NavItem active={activePage === 'notes'} onClick={() => setActivePage('notes')}>
                  <NavLink active={activePage === 'notes'}>Notes</NavLink>
                </NavItem>
                <NavItem active={activePage === 'calendar'} onClick={() => setActivePage('calendar')}>
                  <NavLink active={activePage === 'calendar'}>Calendar</NavLink>
                </NavItem>
                <NavItem active={activePage === 'themes'} onClick={() => setActivePage('themes')}>
                  <NavLink active={activePage === 'themes'}>Themes</NavLink>
                </NavItem>
              </NavList>
            </nav>
          </NavContainer>
        </Sidebar>
        <Content>
          {renderPage()}
        </Content>
      </Container>
    </>
  );
};

export default App;
