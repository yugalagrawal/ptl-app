import { getPartner } from '../../data/session'
import { getPartnerPrsList, isPickupDone } from '../../data/prs'
import { getPartnerDrivers } from '../../data/directory'
import TopBar from '../../components/TopBar'
import PrimaryNav from '../../components/PrimaryNav'
import StatusBadge from '../../components/StatusBadge'
import { Card, EmptyState } from '../../components/ui'

export default function PrimaryHistory() {
  const me = getPartner()
  const drivers = getPartnerDrivers(me.partnerId)
  const rows = getPartnerPrsList(me.partnerId).flatMap((r) =>
    r.pickups.filter(isPickupDone).map((p) => ({ p, prs: r, driver: drivers.find((d) => d.driverId === r.driverId) })),
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Pickup history" subtitle="Completed pickups across your drivers" menu />
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {rows.length === 0 ? (
          <Card><EmptyState icon="history" title="No completed pickups yet" body="Pickups your drivers complete today will appear here." /></Card>
        ) : (
          <Card className="divide-y divide-slate-100 overflow-hidden">
            {rows.map(({ p, prs, driver }) => (
              <div key={p.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{p.client}</p>
                  <p className="truncate text-xs text-slate-500">{p.docketNumber} · {prs.id} · {driver?.name}</p>
                </div>
                <StatusBadge pickup={p} />
              </div>
            ))}
          </Card>
        )}
      </div>
      <PrimaryNav />
    </div>
  )
}
