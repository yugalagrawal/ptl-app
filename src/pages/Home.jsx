import { useNavigate } from 'react-router-dom'
import { getPickups } from '../data/pickups'
import { getPartner } from '../data/session'
import { useDrawer } from '../context/DrawerContext'
import BottomNav from '../components/BottomNav'
import StatusBadge from '../components/StatusBadge'
import ScanIcon from '../components/ScanIcon'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Home() {
  const navigate = useNavigate()
  const drawer = useDrawer()
  const partner = getPartner()
  const pickups = getPickups()
  const pendingCount = pickups.filter((p) => p.status !== 'completed').length

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F6F7F9]">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <button onClick={() => drawer?.open()} className="flex items-center gap-3">
            <span className="relative">
              <span className="w-11 h-11 rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center font-semibold">
                {partner?.name?.[0] || '?'}
              </span>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#F6F7F9]" />
            </span>
            <span className="text-left">
              <span className="block text-sm text-slate-500">{greeting()},</span>
              <span className="block text-lg font-bold text-slate-900 leading-tight">{partner?.name?.split(' ')[0] || 'Partner'}</span>
            </span>
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg shadow-soft"
            aria-label="Notifications"
          >
            🔔
          </button>
        </div>

        <div className="px-5">
          <h2 className="text-lg font-bold text-slate-900">Get started</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/scan')}
              className="relative overflow-hidden text-left rounded-2xl border border-slate-200 bg-white p-4 active:scale-[0.98] transition-transform"
            >
              <span className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-brand-orange/10" />
              <span className="relative w-10 h-10 rounded-full bg-brand-orange/15 flex items-center justify-center text-brand-orange">
                <ScanIcon className="w-5 h-5" />
              </span>
              <p className="relative mt-3 font-semibold text-slate-900">Scan Package</p>
              <p className="relative text-xs text-slate-500 mt-0.5">Add to a pickup</p>
            </button>
            <button
              onClick={() => navigate('/trips')}
              className="relative overflow-hidden text-left rounded-2xl border border-slate-200 bg-white p-4 active:scale-[0.98] transition-transform"
            >
              <span className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-blue-500/10" />
              <span className="relative w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center text-lg">🚚</span>
              <p className="relative mt-3 font-semibold text-slate-900">Trips</p>
              <p className="relative text-xs text-slate-500 mt-0.5">Assigned & in-transit</p>
            </button>
          </div>
        </div>

        <div className="px-5 mt-6">
          <h2 className="text-lg font-bold text-slate-900">Need a hand?</h2>
          <a
            href="mailto:support@letstransport.team"
            className="mt-3 relative overflow-hidden flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 active:scale-[0.98] transition-transform"
          >
            <span className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-brand-navy/5" />
            <span className="relative w-12 h-12 shrink-0 rounded-full bg-brand-navy/10 flex items-center justify-center text-xl">🛟</span>
            <span className="relative">
              <p className="font-semibold text-slate-900">Facing an issue at pickup?</p>
              <p className="text-xs text-slate-500 mt-0.5">Contact LT Support and we'll sort it out</p>
            </span>
          </a>
        </div>

        <div className="px-5 mt-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Today's Pickups</h2>
            <span className="text-xs text-slate-400">{pendingCount} remaining</span>
          </div>

          <div className="mt-3 space-y-3">
            {pickups.map((pu) => (
              <div key={pu.id} className="relative rounded-2xl border border-slate-200 bg-white p-4 pt-5">
                <span className="absolute -top-2.5 right-4">
                  <StatusBadge status={pu.status} />
                </span>
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-brand-orange/10 flex items-center justify-center text-lg">📦</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{pu.client}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{pu.address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>🕒 {pu.slot}</span>
                    <span>·</span>
                    <span>{pu.packages.length}/{pu.expectedPkgs} pkgs</span>
                  </div>
                  <button
                    onClick={() => navigate(`/pickup/${pu.id}`)}
                    className="text-xs font-semibold text-white bg-brand-orange px-3.5 py-1.5 rounded-lg active:scale-95 transition-transform"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
