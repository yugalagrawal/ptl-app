import { useState } from 'react'
import { getPartner } from '../../data/session'
import { deleteTeam, getTeams, saveTeam } from '../../data/directory'
import { getDriversWithRuns } from './shared'
import TopBar from '../../components/TopBar'
import PrimaryNav from '../../components/PrimaryNav'
import Icon from '../../components/Icon'
import { ActionBar, Avatar, Button, Card, EmptyState, TextField } from '../../components/ui'

export default function Teams() {
  const me = getPartner()
  const [, force] = useState(0)
  const [editing, setEditing] = useState(null) // null | { id?, name, driverIds }
  const teams = getTeams(me.partnerId)
  const drivers = getDriversWithRuns(me.partnerId)
  const byId = Object.fromEntries(drivers.map((d) => [d.driverId, d]))

  function toggle(id) {
    const has = editing.driverIds.includes(id)
    setEditing({ ...editing, driverIds: has ? editing.driverIds.filter((x) => x !== id) : [...editing.driverIds, id] })
  }

  function save() {
    saveTeam(me.partnerId, editing)
    setEditing(null)
    force((n) => n + 1)
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Teams" subtitle="Group your drivers by area or hub" menu />
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {teams.length === 0 ? (
          <Card><EmptyState icon="users" title="No teams yet" body="Create a team to group drivers by area, hub or shift." /></Card>
        ) : (
          <Card className="divide-y divide-slate-100 overflow-hidden">
            {teams.map((t) => {
              const members = t.driverIds.map((id) => byId[id]).filter(Boolean)
              const onDuty = members.filter((m) => m.onDuty).length
              return (
                <button key={t.id} onClick={() => setEditing({ id: t.id, name: t.name, driverIds: t.driverIds })} className="block w-full p-4 text-left active:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <Icon name="chevronRight" className="h-4 w-4 text-slate-300" />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{members.length} driver{members.length !== 1 ? 's' : ''} · {onDuty} on duty</p>
                  <div className="mt-3 flex -space-x-2">
                    {members.slice(0, 5).map((m) => <span key={m.driverId} className="rounded-full ring-2 ring-white"><Avatar name={m.name} size="w-8 h-8" /></span>)}
                  </div>
                </button>
              )
            })}
          </Card>
        )}
      </div>
      <ActionBar>
        <Button block icon="plus" onClick={() => setEditing({ name: '', driverIds: [] })}>Create team</Button>
      </ActionBar>

      {editing && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-slate-900/40">
          <button type="button" aria-label="Close" className="flex-1" onClick={() => setEditing(null)} />
          <div className="max-h-[88%] overflow-y-auto rounded-t-3xl bg-white px-4 pb-6 pt-3">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
            <h2 className="text-lg font-semibold text-slate-900">{editing.id ? 'Edit team' : 'New team'}</h2>
            <div className="mt-4"><TextField label="Team name" placeholder="e.g. Gurgaon North" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <p className="mb-2 mt-4 text-[13px] font-medium text-slate-700">Drivers</p>
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
              {drivers.map((d) => {
                const on = editing.driverIds.includes(d.driverId)
                return (
                  <button key={d.driverId} onClick={() => toggle(d.driverId)} className="flex w-full items-center gap-3 p-3 text-left active:bg-slate-50">
                    <Avatar name={d.name} size="w-9 h-9" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900">{d.name}</span>
                      <span className="block text-xs text-slate-500">{d.vehicle}</span>
                    </span>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-brand-orange bg-brand-orange text-white' : 'border-slate-300'}`}>
                      {on && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                )
              })}
            </div>
            <Button block className="mt-5" disabled={editing.name.trim().length < 2 || editing.driverIds.length === 0} onClick={save}>{editing.id ? 'Save changes' : 'Create team'}</Button>
            {editing.id && <Button variant="danger" size="md" block className="mt-1" onClick={() => { deleteTeam(editing.id); setEditing(null); force((n) => n + 1) }}>Delete team</Button>}
            <Button variant="ghost" size="md" block className="mt-1 !text-slate-500" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}
      <PrimaryNav />
    </div>
  )
}
