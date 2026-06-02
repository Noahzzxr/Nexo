import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import { ToastProvider, ToastViewport } from './components/ui/Toast'
import ActivitiesPage from './pages/ActivitiesPage'
import BoletimPage from './pages/BoletimPage'
import CalendarPage from './pages/CalendarPage'
import ConversationsPage from './pages/ConversationsPage'
import DashboardPage from './pages/DashboardPage'
import ExamsPage from './pages/ExamsPage'
import FrequencyPage from './pages/FrequencyPage'
import GamesPage from './pages/GamesPage'
import LandingPage from './pages/LandingPage'
import MaterialsPage from './pages/MaterialsPage'
import ProfilePage from './pages/ProfilePage'
import RankingPage from './pages/RankingPage'

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/boletim" element={<BoletimPage />} />
          <Route path="/atividades" element={<ActivitiesPage />} />
          <Route path="/materiais" element={<MaterialsPage />} />
          <Route path="/jogos" element={<GamesPage />} />
          <Route path="/conversas" element={<ConversationsPage />} />
          <Route path="/provas" element={<ExamsPage />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/frequencia" element={<FrequencyPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastViewport />
    </ToastProvider>
  )
}

export default App
