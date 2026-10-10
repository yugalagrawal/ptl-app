import { useNavigate } from 'react-router-dom'
import { getPickups, isPickupDone } from '../data/prs'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import StatusBadge from '../components/StatusBadge'
import Icon from '../components/Icon'
import { Card, EmptyState, SectionTitle } from '../components/ui'

export default function PickupHistory() {
  const navigate = useNavigate()
  const completed = getPickups().filter(isPickupDone)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Pickup history" menu />
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {completed.length === 0 ? (
          <Card><EmptyState icon="history" title="No completed pickups yet" body="Pickups you finish today will show up here." /></Card>
        ) : (
          <>
            <SectionTitle title="Completed today" subtitle={`${completed.length} pickup${completed.length === 1 ? '' : 's'} finished`} />
            <div className="space-y-3">
              {completed.map((pu) => (
                <button key={pu.id} onClick={() => navigate(`/pickup/${pu.id}`)} className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left active:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-[15px] font-semibold text-slate-900">{pu.client}</p>
                    <StatusBadge pickup={pu} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{pu.id} · {pu.docketNumber}</p>
                  <span className="mt-3 flex items-center gap-0.5 text-[13px] font-semibold text-brand-orange">View details<Icon name="chevronRight" className="h-4 w-4" /></span>
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
