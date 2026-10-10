import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPickups, PICKUP_STATUS } from '../data/prs'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import StatusBadge from '../components/StatusBadge'
import Icon from '../components/Icon'
import { Card, EmptyState, ProgressBar, SectionTitle } from '../components/ui'

// Scan only makes sense once a pickup has its docket + labels (SCANNING), so
// this picks among those; a single candidate opens directly.
export default function ScanEntry() {
  const navigate = useNavigate()
  const readyToScan = getPickups().filter((p) => p.status === PICKUP_STATUS.SCANNING)

  useEffect(() => {
    if (readyToScan.length === 1) navigate(`/pickup/${readyToScan[0].id}/scan`, { replace: true })
  }, [readyToScan.length])

  if (readyToScan.length === 1) return null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Scan packages" menu />
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {readyToScan.length === 0 ? (
          <Card><EmptyState icon="scan" title="Nothing ready to scan" body="Start a pickup, create its docket and print labels. It will appear here once it's ready to scan." /></Card>
        ) : (
          <>
            <SectionTitle title="Ready to scan" subtitle={`${readyToScan.length} pickups ready - select the one you're scanning for`} />
            <div className="space-y-3">
              {readyToScan.map((pu) => (
                <button key={pu.id} onClick={() => navigate(`/pickup/${pu.id}/scan`)} className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left active:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-[15px] font-semibold text-slate-900">{pu.client}</p>
                    <StatusBadge pickup={pu} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{pu.id} · {pu.docketNumber}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar pct={pu.packagesCount ? Math.round((pu.scannedCount / pu.packagesCount) * 100) : 0} className="flex-1" />
                    <span className="text-xs font-semibold text-slate-700">{pu.scannedCount}/{pu.packagesCount}</span>
                  </div>
                  <span className="mt-2.5 flex items-center gap-0.5 text-[13px] font-semibold text-brand-orange">View details<Icon name="chevronRight" className="h-4 w-4" /></span>
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
