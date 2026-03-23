import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import JoinRoomPage from './pages/JoinRoomPage';
import LobbyPage from './pages/LobbyPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fdf9f3] via-[#fbf3df] to-[#f6e6cc] px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(17,24,39,0.06),transparent_50%),radial-gradient(circle_at_85%_80%,rgba(245,158,11,0.2),transparent_45%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/join-room" element={<JoinRoomPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
