import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPickups } from '../data/pickups'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import StatusBadge from '../components/StatusBadge'

// Central entry point for the partner's main action — scanning. Most
// functions in this app revolve around scanning a package into a pickup,
// so this screen figures out which pickup that scan belongs to before
// handing off to the actual scanner (ScanPackage).
export default function ScanEntry() {
  const navigate = useNavigate()
  const activePickups = getPickups().filter((p) => p.status !== 'completed')

  useEffect(() => {
    if (activePickups.length === 1) {
      navigate(`/pickup/${activePickups[0].id}/scan`, { replace: true })
    }
  }, [activePickups.length])

  if (activePickups.length === 1) return null

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Scan Package" menu />
      <div className="flex-1 overflow-y-auto">
        {activePickups.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center py-16">
            <p className="text-3xl mb-2">📷</p>
            <p className="text-sm font-medium text-slate-600">No active pickups to scan for</p>
            <p className="text-xs text-slate-400 mt-1">Once a pickup is assigned to you, it'll show up here.</p>
          </div>
        ) : (
          <>
            <p className="px-4 pt-4 pb-2 text-sm text-slate-500">Select which pickup you're scanning for</p>
            <div className="px-4 space-y-3 pb-4">
              {activePickups.map((pu) => (
                <button
                  key={pu.id}
                  onClick={() => navigate(`/pickup/${pu.id}/scan`)}
                  className="w-full text-left bg-white rounded-2xl p-4 shadow-soft border border-slate-100 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{pu.client}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{pu.id} · {pu.slot}</p>
                    </div>
                    <StatusBadge status={pu.status} />
                  </div>
                  <span className="text-xs text-slate-500 mt-2 block">Scanned: {pu.packages.length} pkgs</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
