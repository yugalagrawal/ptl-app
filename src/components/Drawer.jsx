import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDrawer } from '../context/DrawerContext'
import { getPartner, logout, isPrimary } from '../data/session'
import { getDriverPrs, getPickups, isOnDuty, setDutyStatus } from '../data/prs'
import { Avatar, Switch } from './ui'
import Icon from './Icon'

const DRIVER_MENU = [
  { items: [
    { to: '/home', label: "Today's pickups", icon: 'box' },
    { to: '/route', label: 'Route', icon: 'route' },
    { to: '/scan', label: 'Scan packages', icon: 'scan' },
    { to: '/exceptions', label: 'Exceptions', icon: 'alert', badgeKey: 'exceptions' },
    { to: '/pickup-history', label: 'Pickup history', icon: 'history' },
  ] },
  { title: 'Account', items: [
    { to: '/profile', label: 'My profile & vehicle', icon: 'user' },
    { href: 'mailto:support@letstransport.team', label: 'Help & support', icon: 'support' },
  ] },
]

const PRIMARY_MENU = [
  { items: [
    { to: '/home', label: 'Overview', icon: 'home' },
    { to: '/prs', label: 'Run sheets', icon: 'list' },
    { to: '/drivers', label: 'Drivers', icon: 'users' },
  ] },
  { title: 'Manage', items: [
    { to: '/drivers/new', label: 'Add driver', icon: 'userPlus' },
    { to: '/teams', label: 'Teams', icon: 'users' },
    { to: '/history', label: 'Pickup history', icon: 'history' },
  ] },
  { title: 'Account', items: [
    { to: '/profile', label: 'Account profile', icon: 'user' },
    { href: 'mailto:support@letstransport.team', label: 'Help & support', icon: 'support' },
  ] },
]

export default function Drawer() {
  const { isOpen, close } = useDrawer()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [, force] = useState(0)
  const partner = getPartner()
  const primary = isPrimary()
  const menu = primary ? PRIMARY_MENU : DRIVER_MENU
  const exceptionCount = primary ? 0 : getPickups().filter((p) => p.exception).length
  const driverId = partner?.driverId
  const midRun = !primary && driverId && getDriverPrs(driverId)?.state === 'in_progress'
  const onDuty = driverId ? isOnDuty(driverId) : true

  function go(to) {
    close()
    navigate(to)
  }

  function handleLogout() {
    close()
    logout()
    navigate('/login')
  }

  const active = (to) => pathname === to || (to !== '/home' && pathname.startsWith(`${to}/`) && !(to === '/drivers' && pathname === '/drivers/new'))
  const rowCls = (on) => `relative flex w-full items-center gap-3 px-5 py-3 text-[15px] ${on ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-700 active:bg-slate-50'}`

  return (
    <>
      <div onClick={close} className={`absolute inset-0 z-30 bg-slate-900/40 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />
      <div className={`absolute inset-y-0 left-0 z-40 flex w-[82%] max-w-[310px] flex-col bg-white shadow-xl transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="border-b border-slate-200 px-5 pb-4 pt-16">
          <div className="flex items-center gap-3">
            <Avatar name={partner?.name} size="w-12 h-12" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">{partner?.name}</p>
              <p className="truncate text-xs text-slate-500">{partner?.org}</p>
            </div>
          </div>
          <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">{primary ? 'Primary account' : `Driver · ${partner?.vehicle}`}</span>

          {!primary && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
              <span>
                <span className="block text-[13px] font-medium text-slate-900">{onDuty ? 'On duty' : 'Off duty'}</span>
                <span className="block text-[11px] text-slate-500">{midRun ? 'Finish your run to change' : onDuty ? 'Receiving run sheets' : 'Not receiving run sheets'}</span>
              </span>
              <Switch on={onDuty} disabled={midRun} label="On duty" onChange={(v) => { setDutyStatus(driverId, v); force((n) => n + 1) }} />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {menu.map((group, gi) => (
            <div key={gi}>
              {group.title && <p className="px-5 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{group.title}</p>}
              {group.items.map((item) => {
                const on = item.to && active(item.to)
                const inner = (
                  <>
                    {on && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-brand-orange" />}
                    <Icon name={item.icon} className={`h-5 w-5 ${on ? 'text-brand-orange' : 'text-slate-500'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badgeKey === 'exceptions' && exceptionCount > 0 && (
                      <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">{exceptionCount}</span>
                    )}
                  </>
                )
                return item.href ? (
                  <a key={item.label} href={item.href} className={rowCls(false)}>{inner}</a>
                ) : (
                  <button key={item.to} onClick={() => go(item.to)} className={rowCls(on)}>{inner}</button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-[15px] font-medium text-red-600 active:bg-red-50">
            <Icon name="logout" className="h-5 w-5" />
            Log out
          </button>
          <p className="mt-1 px-2 text-[11px] text-slate-400">FLOW by LetsTransport</p>
        </div>
      </div>
    </>
  )
}
