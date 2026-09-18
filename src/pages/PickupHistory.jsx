import { getPickups } from '../data/pickups'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import StatusBadge from '../components/StatusBadge'

export default function PickupHistory() {
  const completed = getPickups().filter((p) => p.status === 'completed')

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Pickup History" menu />
      <div className="flex-1 overflow-y-auto">
        {completed.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 text-center py-16">
            <p className="text-3xl mb-2">🗂️</p>
            <p className="text-sm font-medium text-slate-600">No completed pickups yet</p>
            <p className="text-xs text-slate-400 mt-1">Pickups you finish today will show up here.</p>
          </div>
        ) : (
          <div className="px-4 pt-4 space-y-3 pb-4">
            {completed.map((pu) => (
              <div key={pu.id} className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900 truncate">{pu.client}</p>
                  <StatusBadge status={pu.status} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{pu.id} · {pu.docket?.docketNo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
