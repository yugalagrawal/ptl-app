import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPickup, scanNextPackage, PICKUP_STATUS } from '../data/prs'
import TopBar from '../components/TopBar'
import { Card, Chip, ProgressBar, Button, ActionBar } from '../components/ui'
import Icon from '../components/Icon'

// Print Labels has already resolved the full pack list (system pack IDs
// and/or stock stickers) by this point — this screen is purely "paste the
// label, then scan" for each pack in that list, up to the final count. The
// docket itself was already raised back at Create Docket, so the last scan
// just closes the pickup out (Picked Up) — nothing gets created here.
export default function ScanPackage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pickup = getPickup(id)
  // pickups are plain mutated module state, not React state — bump forces a
  // re-render after each scan. navigate(0) would do a *real* browser reload
  // here (it's history.go(0), not a soft re-render) and wipe the mock
  // session/data, so it's the wrong tool for this.
  const [, bump] = useState(0)

  if (!pickup) return null

  function handleScan() {
    const updated = scanNextPackage(id)
    if (updated.status === PICKUP_STATUS.PICKED_UP) {
      navigate(`/pickup/${id}/docket`, { replace: true })
    } else {
      bump((n) => n + 1)
    }
  }

  const remaining = pickup.packagesCount - pickup.scannedCount
  const scannedPacks = pickup.packs.filter((pack) => pack.scanned)

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Scan Stickers" back />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">{pickup.client}</p>
            <p className="text-sm font-semibold text-slate-900 tabular-nums">{pickup.scannedCount} of {pickup.packagesCount} scanned</p>
          </div>
          {/* One segment per package, not one continuous bar — makes small
              package counts (2-3) as legible as large ones (30+). */}
          <div className="mt-2 flex gap-1">
            {Array.from({ length: pickup.packagesCount }, (_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i < pickup.scannedCount ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            ))}
          </div>
        </Card>

        <Card className="flex flex-col items-center px-6 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Icon name="scan" className="w-7 h-7" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-900">Stick the label, then scan it</p>
          <p className="mt-0.5 text-xs text-slate-500">{remaining} remaining</p>
        </Card>

        <div>
          <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-slate-500">
            Scanned<span className="ml-1.5 text-slate-400">{scannedPacks.length}</span>
          </h2>
          {scannedPacks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
              No stickers scanned yet
            </div>
          ) : (
            <div className="space-y-2">
              {scannedPacks.map((pack, i) => (
                <Card key={pack.packId} className="flex items-center gap-3 px-3.5 py-3">
                  <span className="w-6 shrink-0 text-xs font-medium tabular-nums text-slate-400">{i + 1}</span>
                  <p className="flex-1 text-sm font-medium text-slate-900 tabular-nums">{pack.packId}</p>
                  <Chip tone={pack.source === 'stock' ? 'warn' : 'neutral'}>{pack.source === 'stock' ? 'Stock' : 'System'}</Chip>
                  <Icon name="checkCircle" className="w-5 h-5 text-emerald-600" />
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ActionBar>
        <Button block icon="scan" onClick={handleScan}>Scan next label</Button>
        <p className="text-center text-xs text-slate-500">Docket <span className="font-medium text-slate-700 tabular-nums">{pickup.docketNumber}</span></p>
      </ActionBar>
    </div>
  )
}
