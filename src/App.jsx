import { Navigate, Route, Routes } from 'react-router-dom'
import PhoneShell from './components/PhoneShell'
import Drawer from './components/Drawer'
import { DrawerProvider } from './context/DrawerContext'
import { getPartner, getSession } from './data/session'
import Login from './pages/Login'
import Home from './pages/Home'
import PickupDetail from './pages/PickupDetail'
import ScanPackage from './pages/ScanPackage'
import ScanEntry from './pages/ScanEntry'
import DocketReview from './pages/DocketReview'
import Trips from './pages/Trips'
import PickupHistory from './pages/PickupHistory'
import Profile from './pages/Profile'
import RoleNotAvailable from './pages/RoleNotAvailable'

function RequireAuth({ children }) {
  return getPartner() ? children : <Navigate to="/login" replace />
}

function RequireSession({ children }) {
  return getSession() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <PhoneShell>
      <DrawerProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/not-available" element={<RequireSession><RoleNotAvailable /></RequireSession>} />
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/scan" element={<RequireAuth><ScanEntry /></RequireAuth>} />
          <Route path="/pickup/:id" element={<RequireAuth><PickupDetail /></RequireAuth>} />
          <Route path="/pickup/:id/scan" element={<RequireAuth><ScanPackage /></RequireAuth>} />
          <Route path="/pickup/:id/docket" element={<RequireAuth><DocketReview /></RequireAuth>} />
          <Route path="/trips" element={<RequireAuth><Trips /></RequireAuth>} />
          <Route path="/pickup-history" element={<RequireAuth><PickupHistory /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="*" element={<Navigate to={getPartner() ? '/home' : '/login'} replace />} />
        </Routes>
        <Drawer />
      </DrawerProvider>
    </PhoneShell>
  )
}
