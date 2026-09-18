import { useNavigate } from 'react-router-dom'
import { getPartner, logout } from '../data/session'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const partner = getPartner()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Profile" menu />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center font-semibold">
            {partner?.name?.[0] || '?'}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{partner?.name}</p>
            <p className="text-xs text-slate-400">{partner?.id} · {partner?.phone}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-xs text-slate-400">Assigned hub</p>
          <p className="text-sm font-medium text-slate-900 mt-0.5">{partner?.hub}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-xl"
        >
          Log out
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
