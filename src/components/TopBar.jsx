import { useNavigate } from 'react-router-dom'
import { useDrawer } from '../context/DrawerContext'

export default function TopBar({ title, back, menu, right }) {
  const navigate = useNavigate()
  const drawer = useDrawer()
  return (
    <div className="sticky top-0 z-10 bg-brand-navy text-white px-4 py-3.5 flex items-center gap-3 shadow-soft">
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 -ml-1"
          aria-label="Back"
        >
          ←
        </button>
      )}
      {menu && (
        <button
          onClick={() => drawer?.open()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 -ml-1"
          aria-label="Open menu"
        >
          ☰
        </button>
      )}
      <h1 className="text-base font-semibold flex-1 truncate">{title}</h1>
      {right}
    </div>
  )
}
