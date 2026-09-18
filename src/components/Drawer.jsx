import { useNavigate } from 'react-router-dom'
import { useDrawer } from '../context/DrawerContext'
import { getPartner, logout } from '../data/session'

const ITEMS = [
  { to: '/home', label: "Today's Pickups", icon: '📦' },
  { to: '/scan', label: 'Scan Package', icon: '📷' },
  { to: '/trips', label: 'Trips', icon: '🚚' },
  { to: '/pickup-history', label: 'Pickup History', icon: '🗂️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export default function Drawer() {
  const { isOpen, close } = useDrawer()
  const navigate = useNavigate()
  const partner = getPartner()

  function go(to) {
    close()
    navigate(to)
  }

  function handleLogout() {
    close()
    logout()
    navigate('/login')
  }

  return (
    <>
      <div
        onClick={close}
        className={`absolute inset-0 z-30 bg-slate-900/40 transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`absolute inset-y-0 left-0 z-40 w-[78%] max-w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-brand-navy text-white px-5 pt-8 pb-5">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center font-semibold text-lg">
            {partner?.name?.[0] || '?'}
          </div>
          <p className="mt-3 font-semibold">{partner?.name}</p>
          <p className="text-xs text-slate-300 mt-0.5">{partner?.hub}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {ITEMS.map((item) => (
            <button
              key={item.to}
              onClick={() => go(item.to)}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <a
            href="mailto:support@letstransport.team"
            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
          >
            <span className="text-lg leading-none">🛟</span>
            Help & Support
          </a>
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <span className="text-lg leading-none">↩︎</span>
            Log out
          </button>
        </div>
      </div>
    </>
  )
}
