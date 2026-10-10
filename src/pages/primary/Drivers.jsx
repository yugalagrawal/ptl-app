import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPartner } from '../../data/session'
import { PRS_STATE_BADGE, PRS_STATE_LABEL, setDutyStatus } from '../../data/prs'
import TopBar from '../../components/TopBar'
import PrimaryNav from '../../components/PrimaryNav'
import Icon from '../../components/Icon'
import { Avatar, Button, Card, EmptyState, LinkButton, ProgressBar, SectionTitle, Switch, Tabs } from '../../components/ui'
import { getDriversWithRuns } from './shared'

export default function Drivers() {
  const navigate = useNavigate()
  const me = getPartner()
  const [, force] = useState(0)
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const drivers = getDriversWithRuns(me.partnerId)
  const tabs = [
    { key: 'all', label: 'All', count: drivers.length },
    { key: 'on', label: 'On duty', count: drivers.filter((d) => d.onDuty).length },
    { key: 'off', label: 'Off duty', count: drivers.filter((d) => !d.onDuty).length },
  ]
  const term = q.trim().toLowerCase()
  const shown = drivers
    .filter((d) => (tab === 'all' ? true : tab === 'on' ? d.onDuty : !d.onDuty))
    .filter((d) => !term || d.name.toLowerCase().includes(term) || d.vehicle.toLowerCase().includes(term))

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Drivers" subtitle={`${drivers.length} linked to ${me.org}`} menu right={<Button size="sm" variant="secondary" icon="plus" onClick={() => navigate('/drivers/new')}>Add</Button>} />
      <div className="bg-white px-4 pb-1 pt-3">
        <label className="flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-3">
          <Icon name="user" className="h-[18px] w-[18px] text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or vehicle" className="h-full flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400" />
        </label>
      </div>
      <div className="bg-white px-2"><Tabs options={tabs} value={tab} onChange={setTab} /></div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <p className="mb-3 text-xs text-slate-500">Run sheets are assigned automatically by LT to drivers who are on duty.</p>
        {shown.length === 0 ? (
          <Card><EmptyState icon="users" title="No drivers found" /></Card>
        ) : (
          <div className="space-y-3">
            {shown.map((d) => {
              const midRun = d.prs && d.prs.state === 'in_progress'
              return (
                <Card key={d.driverId} className={`p-4 ${d.onDuty ? '' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <Avatar name={d.name} size="w-12 h-12" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-slate-900">{d.name}</p>
                      <p className="text-xs text-slate-500">{d.vehicle}</p>
                      <p className="text-xs text-slate-400">{d.mobile}</p>
                    </div>
                    <LinkButton href={`tel:${d.mobile}`} size="sm" icon="phone" aria-label={`Call ${d.name}`}>Call</LinkButton>
                  </div>

                  {d.prs ? (
                    <button onClick={() => navigate(`/prs/${d.prs.id}`)} className="mt-3 block w-full rounded-xl bg-slate-100 px-3.5 py-3 text-left active:bg-slate-200">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-slate-600">{d.prs.id} · {d.prs.hubName}</span>
                        <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${PRS_STATE_BADGE[d.prs.state]}`}>{PRS_STATE_LABEL[d.prs.state]}</span>
                      </div>
                      <ProgressBar pct={d.prs.pct} className="mt-2 !bg-slate-300/60" />
                      <p className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                        <span>{d.prs.done}/{d.prs.total} pickups{d.prs.exceptions ? ` · ${d.prs.exceptions} exception${d.prs.exceptions > 1 ? 's' : ''}` : ''}</span>
                        <Icon name="chevronRight" className="h-4 w-4 text-slate-400" />
                      </p>
                    </button>
                  ) : (
                    <p className="mt-3 rounded-xl bg-slate-100 px-3.5 py-3 text-sm text-slate-500">No run sheet assigned yet</p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[13px] text-slate-700">{d.onDuty ? 'On duty' : 'Off duty'}{midRun && <span className="text-slate-400"> · mid-run</span>}</span>
                    <Switch on={d.onDuty} disabled={midRun} label={`${d.name} on duty`} onChange={(v) => { setDutyStatus(d.driverId, v); force((n) => n + 1) }} />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      <PrimaryNav />
    </div>
  )
}
