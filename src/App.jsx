import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PhoneShell from './components/PhoneShell'
import Drawer from './components/Drawer'
import { DrawerProvider } from './context/DrawerContext'
import { getPartner, getSession, isDriver, isPrimary } from './data/session'
import TruckLoader from './components/TruckLoader'
import Login from './pages/Login'
import Home from './pages/Home'
import RoutePage from './pages/Route'
import Exceptions from './pages/Exceptions'
import PickupDetail from './pages/PickupDetail'
import FieldDetails from './pages/FieldDetails'
import PrintLabels from './pages/PrintLabels'
import ReportException from './pages/ReportException'
import ScanPackage from './pages/ScanPackage'
import ScanEntry from './pages/ScanEntry'
import MiniHubScan from './pages/MiniHubScan'
import DocketReview from './pages/DocketReview'
import PickupHistory from './pages/PickupHistory'
import Profile from './pages/Profile'
import RoleNotAvailable from './pages/RoleNotAvailable'
import PrimaryHome from './pages/primary/PrimaryHome'
import PrsList from './pages/primary/PrsList'
import PrsDetail from './pages/primary/PrsDetail'
import Drivers from './pages/primary/Drivers'
import AddDriver from './pages/primary/AddDriver'
import Teams from './pages/primary/Teams'
import PrimaryHistory from './pages/primary/PrimaryHistory'

function RequireAuth({ children }) {
  return getPartner() ? children : <Navigate to="/login" replace />
}

function RequireDriver({ children }) {
  if (!getPartner()) return <Navigate to="/login" replace />
  return isDriver() ? children : <Navigate to="/home" replace />
}

function RequirePrimary({ children }) {
  if (!getPartner()) return <Navigate to="/login" replace />
  return isPrimary() ? children : <Navigate to="/home" replace />
}

function HomeByRole() {
  if (!getPartner()) return <Navigate to="/login" replace />
  return isPrimary() ? <PrimaryHome /> : <Home />
}

function RequireSession({ children }) {
  return getSession() ? children : <Navigate to="/login" replace />
}

const SPLASH_MS = 2600

export default function App() {
  const [splash, setSplash] = useState('show') // 'show' | 'out' | 'done'
  useEffect(() => {
    const a = setTimeout(() => setSplash('out'), SPLASH_MS)
    const b = setTimeout(() => setSplash('done'), SPLASH_MS + 350)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])

  return (
    <PhoneShell>
      {splash !== 'done' && (
        <div className={splash === 'out' ? 'flow-splash-out absolute inset-0 z-50' : 'absolute inset-0 z-50'}>
          <TruckLoader duration={SPLASH_MS - 200} label="Starting FLOW" />
        </div>
      )}
      <DrawerProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/not-available" element={<RequireSession><RoleNotAvailable /></RequireSession>} />
          <Route path="/home" element={<HomeByRole />} />
          <Route path="/prs" element={<RequirePrimary><PrsList /></RequirePrimary>} />
          <Route path="/prs/:id" element={<RequirePrimary><PrsDetail /></RequirePrimary>} />
          <Route path="/drivers" element={<RequirePrimary><Drivers /></RequirePrimary>} />
          <Route path="/drivers/new" element={<RequirePrimary><AddDriver /></RequirePrimary>} />
          <Route path="/teams" element={<RequirePrimary><Teams /></RequirePrimary>} />
          <Route path="/history" element={<RequirePrimary><PrimaryHistory /></RequirePrimary>} />
          <Route path="/route" element={<RequireDriver><RoutePage /></RequireDriver>} />
          <Route path="/exceptions" element={<RequireDriver><Exceptions /></RequireDriver>} />
          <Route path="/scan" element={<RequireDriver><ScanEntry /></RequireDriver>} />
          <Route path="/pickup/:id" element={<RequireDriver><PickupDetail /></RequireDriver>} />
          <Route path="/pickup/:id/details" element={<RequireDriver><FieldDetails /></RequireDriver>} />
          <Route path="/pickup/:id/print-labels" element={<RequireDriver><PrintLabels /></RequireDriver>} />
          <Route path="/pickup/:id/exception" element={<RequireDriver><ReportException /></RequireDriver>} />
          <Route path="/pickup/:id/scan" element={<RequireDriver><ScanPackage /></RequireDriver>} />
          <Route path="/pickup/:id/docket" element={<RequireDriver><DocketReview /></RequireDriver>} />
          <Route path="/mini-hub-scan" element={<RequireDriver><MiniHubScan /></RequireDriver>} />
          <Route path="/pickup-history" element={<RequireDriver><PickupHistory /></RequireDriver>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="*" element={<Navigate to={getPartner() ? '/home' : '/login'} replace />} />
        </Routes>
        <Drawer />
      </DrawerProvider>
    </PhoneShell>
  )
}
