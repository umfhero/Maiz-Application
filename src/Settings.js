// In your main App.js or Sidebar component

import React, { useState } from 'react';
import styled from 'styled-components';
import Notes from './Notes';
import Settings from './Settings';  // Import the Settings component

const Sidebar = styled.div`
  width: 250px;
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  color: #fff;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Logo = styled.img`
  width: 150px;
  margin-bottom: 20px;
  align-self: flex-start;
`;

const NavContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const NavItem = styled.li`
  margin: 20px 0;
  opacity: 0.6;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const NavLink = styled.div`
  padding: 25px 20px;
  display: inline-block;
  width: 100%;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  background-color: #181818;
  min-height: 100vh;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #282828;
  color: #fff;
`;

const App = () => {
  const [activePage, setActivePage] = useState('notes');

  const renderPage = () => {
    switch (activePage) {
      case 'notes':
        return <Notes />;
      case 'settings':  // Add the settings case
        return <Settings />;
      default:
        return <Notes />;
    }
  };

  return (
    <Container>
      <Sidebar>
        <Logo src="path/to/logo.png" alt="Maiz Logo" />
        <NavContainer>
          <nav>
            <NavList>
              <NavItem onClick={() => setActivePage('notes')}>
                <NavLink>Notes</NavLink>
              </NavItem>
              {/* Add the Settings tab here */}
              <NavItem onClick={() => setActivePage('settings')}>
                <NavLink>Settings</NavLink>
              </NavItem>
            </NavList>
          </nav>
        </NavContainer>
      </Sidebar>
      <Content>{renderPage()}</Content>
    </Container>
  );
};

export default App;
