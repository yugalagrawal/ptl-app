import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPartner } from '../../data/session'
import { assignPrs, canReassign, driverBlockReason, getPrsById, PRS_STATE_BADGE, PRS_STATE_LABEL } from '../../data/prs'
import { getDriversWithRuns } from './shared'
import TopBar from '../../components/TopBar'
import PrimaryNav from '../../components/PrimaryNav'
import StatusBadge from '../../components/StatusBadge'
import Icon from '../../components/Icon'
import { ActionBar, Avatar, Button, Card, HeroHeader, LinkButton, ProgressBar, SectionTitle, StatBox } from '../../components/ui'

const REASONS = ['Driver unavailable', 'Vehicle issue', 'Route change', 'Other']

export default function PrsDetail() {
  const { id } = useParams()
  const me = getPartner()
  const navigate = useNavigate()
  const [, force] = useState(0)
  const [sheet, setSheet] = useState(false)
  const [picked, setPicked] = useState(null)
  const [reason, setReason] = useState(null)
  const prs = getPrsById(id)

  if (!prs || prs.partnerId !== me.partnerId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <TopBar title="Run sheet" back />
        <p className="py-16 text-center text-sm text-slate-500">Run sheet not found.</p>
        <PrimaryNav />
      </div>
    )
  }

  const drivers = getDriversWithRuns(me.partnerId)
  const driver = drivers.find((d) => d.driverId === prs.driverId)
  const editable = canReassign(prs.id)
  const pickedDriver = drivers.find((d) => d.driverId === picked)
  const swapWith = pickedDriver?.prs && pickedDriver.prs.id !== prs.id ? pickedDriver.prs.id : null
  const midRun = prs.state === 'in_progress'

  function openSheet() {
    setPicked(null)
    setReason(null)
    setSheet(true)
  }

  function confirm() {
    assignPrs(prs.id, picked, { reason, by: me.name })
    setSheet(false)
    force((n) => n + 1)
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <HeroHeader title={prs.id} subtitle={prs.hubName} back onBack={() => navigate(-1)} icon="list" />
      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        <div className="text-center">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${PRS_STATE_BADGE[prs.state]}`}>{PRS_STATE_LABEL[prs.state]}</span>
          <p className="mt-1.5 text-xs text-slate-500">Generated {prs.generatedAt} · assigned by LT</p>
        </div>

        <div>
          <SectionTitle title="Summary" />
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Pickups done" value={prs.done} sub={`/ ${prs.total}`} />
            <StatBox label="Progress" value={`${prs.pct}%`} />
            <StatBox label="Total weight" value={prs.weightKg} sub="kg" />
            <StatBox label="Exceptions" value={prs.exceptions} />
          </div>
          <ProgressBar pct={prs.pct} className="mt-3" />
        </div>

        <div>
          <SectionTitle title="Driver" />
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name={driver?.name} unassigned={!driver} size="w-11 h-11" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{driver ? driver.name : 'No driver'}</p>
                <p className="text-xs text-slate-500">{driver ? `${driver.vehicle} · ${driver.mobile}` : 'No on-duty driver was available'}</p>
              </div>
              {driver && <LinkButton href={`tel:${driver.mobile}`} size="sm" icon="phone">Call</LinkButton>}
            </div>
            {driver && editable && <Button variant="secondary" size="md" icon="swap" block className="mt-3" onClick={openSheet}>Switch driver</Button>}
            {midRun && <p className="mt-2 text-xs text-slate-500">Run is in progress. Completed pickups stay as they are; the new driver continues the remaining ones.</p>}
          </Card>
        </div>

        <div>
          <SectionTitle title="Pickups" subtitle={`${prs.total} stops on this run sheet`} />
          <Card className="divide-y divide-slate-100 overflow-hidden">
            {prs.pickups.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[13px] font-semibold text-slate-600">{p.sequence}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{p.client}</p>
                  <p className="truncate text-xs text-slate-500">{p.slot} · {p.packagesCount ?? p.packagesEstimate} pkgs · {p.estWeightKg} kg</p>
                </div>
                <StatusBadge pickup={p} />
              </div>
            ))}
          </Card>
        </div>

        <div>
          <SectionTitle title="Activity" />
          <Card className="divide-y divide-slate-100 px-4">
            {[...prs.log].reverse().map((l, i) => (
              <div key={i} className="py-3">
                <p className="text-sm text-slate-900">{l.text}</p>
                <p className="mt-0.5 text-xs text-slate-500">{l.by} · {l.at}{l.reason ? ` · ${l.reason}` : ''}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {!driver && editable && (
        <ActionBar>
          <Button block onClick={openSheet}>Assign driver</Button>
        </ActionBar>
      )}

      {sheet && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-slate-900/40">
          <button type="button" aria-label="Close" className="flex-1" onClick={() => setSheet(false)} />
          <div className="max-h-[85%] overflow-y-auto rounded-t-3xl bg-white px-4 pb-6 pt-3">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
            <h2 className="text-lg font-semibold text-slate-900">{driver ? 'Switch driver' : 'Assign driver'}</h2>
            <p className="mt-0.5 text-[13px] text-slate-500">{prs.id} · {prs.hubName}</p>

            <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
              {drivers.filter((d) => d.driverId !== prs.driverId).map((d) => {
                const block = driverBlockReason(prs.id, d.driverId)
                const on = picked === d.driverId
                const hint = block || (d.prs ? `On ${d.prs.id} · will swap` : 'Available')
                return (
                  <button key={d.driverId} disabled={!!block} onClick={() => setPicked(d.driverId)} className={`flex w-full items-center gap-3 p-3.5 text-left ${block ? 'opacity-50' : 'active:bg-slate-50'}`}>
                    <Avatar name={d.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900">{d.name}</span>
                      <span className="block text-xs text-slate-500">{d.vehicle} · {hint}</span>
                    </span>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${on ? 'border-brand-orange bg-brand-orange text-white' : 'border-slate-300'}`}>
                      {on && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                )
              })}
            </div>

            {swapWith && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {pickedDriver.name.split(' ')[0]} will take {prs.id} and {driver ? driver.name.split(' ')[0] : 'no one'} will take {swapWith}.
              </p>
            )}

            <p className="mb-2 mt-4 text-[13px] font-medium text-slate-700">Reason</p>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button key={r} onClick={() => setReason(r)} className={`rounded-full border px-3 py-1.5 text-[13px] font-medium ${reason === r ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>{r}</button>
              ))}
            </div>

            <Button block className="mt-5" disabled={!picked || !reason} onClick={confirm}>
              {picked && reason ? `${swapWith ? 'Swap with' : 'Assign to'} ${pickedDriver.name.split(' ')[0]}` : picked ? 'Select a reason' : 'Select a driver'}
            </Button>
            <Button variant="ghost" size="md" block className="mt-1 !text-slate-500" onClick={() => setSheet(false)}>Cancel</Button>
          </div>
        </div>
      )}
      <PrimaryNav />
    </div>
  )
}
