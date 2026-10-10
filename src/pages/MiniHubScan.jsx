import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPickups, getActivePrs, scanAtMiniHub, PICKUP_STATUS } from '../data/prs'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import Icon from '../components/Icon'
import { Card, Chip, Button, ProgressBar, ActionBar } from '../components/ui'

// Final leg of the lifecycle: once every pickup on the PRS has been Picked
// Up, the partner drops the dockets at the assigned Mini Hub and scans each
// one in — Reached Mini Hub is the resulting status per docket/pickup.
export default function MiniHubScan() {
  const navigate = useNavigate()
  const prs = getActivePrs()
  const [, bump] = useState(0)
  const pickups = getPickups()

  const pending = pickups.filter((p) => p.status === PICKUP_STATUS.PICKED_UP)
  const done = pickups.filter((p) => p.status === PICKUP_STATUS.REACHED_MINI_HUB)
  const allDone = pending.length === 0 && done.length === pickups.length

  function handleScan(id) {
    scanAtMiniHub(id)
    bump((n) => n + 1)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Mini Hub Drop" back />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <Card className="p-4">
          <p className="text-xs text-slate-500">Dropping at</p>
          <p className="text-[15px] font-semibold text-slate-900">{prs.hubName}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Dockets scanned in</span>
            <span className="font-medium text-slate-900 tabular-nums">{done.length} of {pickups.length}</span>
          </div>
          <ProgressBar pct={pickups.length ? (done.length / pickups.length) * 100 : 0} className="mt-1.5" />
        </Card>

        {allDone ? (
          <div className="flex flex-col items-center text-center py-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <Icon name="check" className="w-6 h-6" />
            </span>
            <p className="mt-3 text-base font-semibold text-slate-900">All dockets reached Mini Hub</p>
            <p className="text-sm text-slate-500 mt-0.5">{prs.id} is complete.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map((p) => (
              <Card key={p.id} className="flex items-center justify-between gap-3 p-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.client}</p>
                  <p className="text-xs text-slate-500 mt-0.5 tabular-nums">Docket {p.docketNumber}</p>
                </div>
                <Button variant="secondary" size="md" icon="scan" className="shrink-0" onClick={() => handleScan(p.id)}>
                  Scan in
                </Button>
              </Card>
            ))}
            {done.map((p) => (
              <Card key={p.id} className="flex items-center justify-between gap-3 p-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.client}</p>
                  <p className="text-xs text-slate-500 mt-0.5 tabular-nums">Docket {p.docketNumber}</p>
                </div>
                <Chip tone="success" className="shrink-0">Reached Mini Hub</Chip>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ActionBar>
        <Button variant={allDone ? 'primary' : 'secondary'} block onClick={() => navigate('/home')}>Back to home</Button>
      </ActionBar>
      <BottomNav />
    </div>
  )
}
