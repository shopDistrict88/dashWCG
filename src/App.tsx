import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastContainer } from './components/Toast'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { Home } from './pages/Home'
import { CreatorHub } from './pages/CreatorHub'
import { MusicStudio } from './pages/MusicStudio'
import { CreativeLibrary } from './pages/CreativeLibrary'
import { CreatorTools } from './pages/CreatorTools'
import { Projects } from './pages/Projects'
import { Commerce } from './pages/Commerce'
import { Settings } from './pages/Settings'
import { BrandBuilder } from './pages/BrandBuilder'
import { ContentStudio } from './pages/ContentStudio'
import { LaunchLab } from './pages/LaunchLab'
import { Ideas } from './pages/Ideas'
import { Funding } from './pages/Funding'
import { Growth } from './pages/Growth'
import { Community } from './pages/Community'
import { Marketplace } from './pages/Marketplace'
import { AI } from './pages/AI'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="ai" element={<AI />} />
          <Route path="creator-hub" element={<CreatorHub />} />
          <Route path="music-studio" element={<MusicStudio />} />
          <Route path="creative-library" element={<CreativeLibrary />} />
          <Route path="creator-tools" element={<CreatorTools />} />
          <Route path="brand-builder" element={<BrandBuilder />} />
          <Route path="content-studio" element={<ContentStudio />} />
          <Route path="projects" element={<Projects />} />
          <Route path="launch-lab" element={<LaunchLab />} />
          <Route path="commerce" element={<Commerce />} />
          <Route path="funding" element={<Funding />} />
          <Route path="growth" element={<Growth />} />
          <Route path="community" element={<Community />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="ideas" element={<Ideas />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

