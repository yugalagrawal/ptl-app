import { useNavigate, useParams } from 'react-router-dom'
import { getPickup, getPickups, isReadyForMiniHub, PICKUP_STATUS } from '../data/prs'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import { Card, Chip, Button, ActionBar } from '../components/ui'

// Shown automatically right after the last sticker is scanned. The docket
// itself was already created back at the Create Docket step — this is a
// read-only confirmation that the pickup is now Picked Up, not a "create"
// step.
export default function DocketReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pickup = getPickup(id)

  if (!pickup) return null

  // Next actionable stop in route order, so the primary action moves a
  // partner straight on to their run instead of dropping them back at a
  // list they have to re-scan themselves.
  const nextStop = getPickups().find((p) => p.id !== id && p.status !== PICKUP_STATUS.PICKED_UP && p.status !== PICKUP_STATUS.REACHED_MINI_HUB)
  const readyForMiniHub = isReadyForMiniHub()

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Picked Up" />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <div className="flex flex-col items-center text-center py-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            <Icon name="check" className="w-6 h-6" />
          </span>
          <p className="mt-3 text-base font-semibold text-slate-900">Pickup complete</p>
          <p className="text-sm text-slate-500 mt-0.5">{pickup.client} · Stop {pickup.sequence}</p>
        </div>

        <Card className="p-4">
          <p className="text-xs text-slate-500">Docket number</p>
          <p className="text-lg font-semibold text-slate-900 tabular-nums">{pickup.docketNumber}</p>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">Packages</p>
              <p className="text-[15px] font-semibold text-slate-900 tabular-nums">{pickup.packagesCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Weight</p>
              <p className="text-[15px] font-semibold text-slate-900 tabular-nums">{pickup.actualWeightKg} kg</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Scanned</p>
              <p className="text-[15px] font-semibold text-emerald-700">100%</p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-slate-500">
            Pack IDs<span className="ml-1.5 text-slate-400">{pickup.packs.length}</span>
          </h2>
          <div className="space-y-2">
            {pickup.packs.map((pack, i) => (
              <Card key={pack.packId} className="flex items-center gap-3 px-3.5 py-3">
                <span className="w-6 shrink-0 text-xs font-medium tabular-nums text-slate-400">{i + 1}</span>
                <p className="flex-1 text-sm font-medium text-slate-900 tabular-nums">{pack.packId}</p>
                <Chip tone={pack.source === 'stock' ? 'warn' : 'neutral'}>{pack.source === 'stock' ? 'Stock' : 'System'}</Chip>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ActionBar>
        {nextStop ? (
          <Button block onClick={() => navigate(`/pickup/${nextStop.id}`)}>
            Go to stop {nextStop.sequence}: {nextStop.client}
          </Button>
        ) : readyForMiniHub ? (
          <Button block onClick={() => navigate('/mini-hub-scan')}>Continue to Mini Hub drop</Button>
        ) : (
          <Button block onClick={() => navigate('/home')}>Back to pickups</Button>
        )}
        {(nextStop || readyForMiniHub) && (
          <Button variant="ghost" size="md" block onClick={() => navigate('/home')}>Back to pickups</Button>
        )}
      </ActionBar>
    </div>
  )
}
