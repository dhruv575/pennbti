import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/general/Header';
import UserLogin from './pages/userLogin';
import RoomLogin from './pages/roomLogin';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import Test from './pages/Test';
import Landing from './pages/landing';
import styled from 'styled-components';

const MainContent = styled.div`
  margin-top: 80px;
  
  @media (max-width: 768px) {
    margin-top: 60px;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/userLogin" element={<UserLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<Test />} />
          <Route path="/roomLogin" element={<RoomLogin />} />
          <Route path="/room/:code" element={<Room />} />
          {/* Other routes */}
        </Routes>
      </MainContent>
    </BrowserRouter>
  );
}

export default App;
