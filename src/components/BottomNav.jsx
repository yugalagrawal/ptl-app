import { NavLink, useNavigate } from 'react-router-dom'
import { getPickups } from '../data/prs'
import Icon from './Icon'

const LEFT = [
  { to: '/home', label: 'Pickups', icon: 'box' },
  { to: '/route', label: 'Route', icon: 'route' },
]
const RIGHT = [
  { to: '/exceptions', label: 'Exceptions', icon: 'alert' },
  { to: '/pickup-history', label: 'History', icon: 'history' },
]

function Tab({ to, label, icon, badge }) {
  return (
    <NavLink to={to} className={({ isActive }) => `relative flex flex-1 flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-medium ${isActive ? 'text-brand-orange' : 'text-slate-500'}`}>
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute inset-x-6 top-0 h-0.5 rounded-b bg-brand-orange" />}
          <span className="relative">
            <Icon name={icon} className="w-[22px] h-[22px]" />
            {badge > 0 && <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">{badge}</span>}
          </span>
          {label}
        </>
      )}
    </NavLink>
  )
}

export default function BottomNav() {
  const navigate = useNavigate()
  const exceptionCount = getPickups().filter((p) => p.exception).length

  return (
    <div className="z-10 flex shrink-0 items-center border-t border-slate-200 bg-white">
      {LEFT.map((t) => <Tab key={t.to} {...t} />)}
      <div className="flex flex-1 flex-col items-center pb-2 pt-1.5">
        <button onClick={() => navigate('/scan')} className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-white shadow-sm active:bg-brand-orange-dark" aria-label="Scan packages">
          <Icon name="scan" className="w-[22px] h-[22px]" />
        </button>
        <span className="mt-0.5 text-[11px] font-medium text-slate-500">Scan</span>
      </div>
      {RIGHT.map((t) => <Tab key={t.to} {...t} badge={t.to === '/exceptions' ? exceptionCount : 0} />)}
    </div>
  )
}
