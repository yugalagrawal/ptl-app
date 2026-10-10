import { useNavigate } from 'react-router-dom'
import { useDrawer } from '../context/DrawerContext'
import Icon from './Icon'

export default function TopBar({ title, subtitle, back, menu, right }) {
  const navigate = useNavigate()
  const drawer = useDrawer()
  const btn = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-700 active:bg-slate-100 -ml-2'
  return (
    <div className="sticky top-0 z-10 flex min-h-[56px] items-center gap-1 border-b border-slate-200 bg-white px-4">
      {back && (
        <button onClick={() => navigate(-1)} className={btn} aria-label="Back">
          <Icon name="chevronLeft" className="w-6 h-6" />
        </button>
      )}
      {menu && (
        <button onClick={() => drawer?.open()} className={btn} aria-label="Open menu">
          <Icon name="menu" className="w-6 h-6" />
        </button>
      )}
      <div className="min-w-0 flex-1 py-2">
        <h1 className="truncate text-[17px] font-semibold leading-tight text-slate-900">{title}</h1>
        {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
