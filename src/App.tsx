import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getProfile } from './db'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Charts from './pages/Charts'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  useEffect(() => {
    getProfile().then(p => setHasProfile(!!p))
  }, [])

  if (hasProfile === null) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={
          hasProfile ? <Navigate to="/" replace /> : <Onboarding onComplete={() => setHasProfile(true)} />
        } />
        <Route path="/" element={
          !hasProfile ? <Navigate to="/onboarding" replace /> :
          <Layout><Home /></Layout>
        } />
        <Route path="/charts" element={
          !hasProfile ? <Navigate to="/onboarding" replace /> :
          <Layout><Charts /></Layout>
        } />
        <Route path="/profile" element={
          !hasProfile ? <Navigate to="/onboarding" replace /> :
          <Layout><Profile /></Layout>
        } />
        <Route path="*" element={<Navigate to={hasProfile ? '/' : '/onboarding'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
