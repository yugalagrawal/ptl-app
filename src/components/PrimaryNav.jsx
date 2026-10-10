import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const TABS = [
  { to: '/home', label: 'Overview', icon: 'home' },
  { to: '/prs', label: 'Run Sheets', icon: 'list' },
  { to: '/drivers', label: 'Drivers', icon: 'users' },
  { to: '/profile', label: 'Account', icon: 'user' },
]

export default function PrimaryNav() {
  return (
    <div className="z-10 flex shrink-0 items-center border-t border-slate-200 bg-white">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => `relative flex flex-1 flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-medium ${isActive ? 'text-brand-orange' : 'text-slate-500'}`}>
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute inset-x-6 top-0 h-0.5 rounded-b bg-brand-orange" />}
              <Icon name={t.icon} className="w-[22px] h-[22px]" />
              {t.label}
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
