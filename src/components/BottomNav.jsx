import { NavLink, useNavigate } from 'react-router-dom'
import ScanIcon from './ScanIcon'

const SIDE_TABS_LEFT = [
  { to: '/pickup-history', label: 'History', icon: '🗂️' },
  { to: '/home', label: 'Pickups', icon: '📦' },
]
const SIDE_TABS_RIGHT = [
  { to: '/trips', label: 'Trips', icon: '🚚' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

function SideTab({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
          isActive ? 'text-brand-orange' : 'text-slate-400'
        }`
      }
    >
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </NavLink>
  )
}

export default function BottomNav() {
  const navigate = useNavigate()
  return (
    <div className="shrink-0 z-10 bg-white border-t border-slate-200 flex items-center">
      {SIDE_TABS_LEFT.map((tab) => (
        <SideTab key={tab.to} {...tab} />
      ))}

      <div className="flex-1 flex justify-center">
        <button
          onClick={() => navigate('/scan')}
          className="-translate-y-4 w-14 h-14 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg border-4 border-white active:scale-95 transition-transform"
          aria-label="Scan package"
        >
          <ScanIcon className="w-6 h-6" />
        </button>
      </div>

      {SIDE_TABS_RIGHT.map((tab) => (
        <SideTab key={tab.to} {...tab} />
      ))}
    </div>
  )
}
