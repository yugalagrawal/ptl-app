import { useNavigate } from 'react-router-dom'
import { getPartner } from '../../data/session'
import { PRS_STATE_BADGE, PRS_STATE_LABEL } from '../../data/prs'
import { useDrawer } from '../../context/DrawerContext'
import PrimaryNav from '../../components/PrimaryNav'
import HeaderActions from '../../components/HelpCentre'
import Icon from '../../components/Icon'
import { Avatar, Card, Hero, HeroStat, InfoCallout, ProgressBar, PrototypeTag, SectionTitle } from '../../components/ui'
import PrsCard from './PrsCard'
import { getPartnerOverview, greeting } from './shared'

export default function PrimaryHome() {
  const navigate = useNavigate()
  const drawer = useDrawer()
  const me = getPartner()
  const o = getPartnerOverview(me.partnerId)
  const active = o.prsList.filter((r) => r.state === 'in_progress' || r.state === 'not_started' || r.state === 'unassigned')
  const attention = o.unassigned.length + o.exceptionList.length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto pb-6">
        <Hero className="rounded-b-[28px] px-4 pb-5 pt-5">
          <div className="flex items-center justify-between">
            <button onClick={() => drawer?.open()} className="flex items-center gap-3 text-left">
              <Avatar name={me.name} size="w-11 h-11" />
              <span>
                <span className="block text-[13px] text-white/70">{greeting()}<PrototypeTag role="Primary" /></span>
                <span className="block text-lg font-semibold leading-tight text-white">{me.name.split(' ')[0]}</span>
              </span>
            </button>
            <HeaderActions dark />
          </div>

          <p className="mt-5 text-xs text-white/60">Today's operations</p>
          <p className="text-[17px] font-semibold text-white">{me.org}</p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <HeroStat label="Run sheets" value={o.prsList.length} onClick={() => navigate('/prs')} />
            <HeroStat label="Drivers on run" value={o.onRun} sub={`/${o.drivers.length}`} onClick={() => navigate('/drivers')} />
            <HeroStat label="Pickups done" value={o.donePickups} sub={`/${o.totalPickups}`} />
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-white/70">
              <span>Overall completion</span><span className="font-semibold text-white">{o.pct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-brand-orange transition-all" style={{ width: `${o.pct}%` }} />
            </div>
          </div>
        </Hero>

        <div className="mt-5 px-4">
          <InfoCallout>Run sheets are assigned automatically by LT to drivers who are on duty. Open a run sheet to switch its driver.</InfoCallout>
        </div>

        {attention > 0 && (
          <div className="mt-6 px-4">
            <SectionTitle title="Needs attention" subtitle={`${attention} item${attention > 1 ? 's' : ''} to review`} />
            <Card className="divide-y divide-slate-100 overflow-hidden">
              {o.unassigned.map((r) => (
                <button key={r.id} onClick={() => navigate(`/prs/${r.id}`)} className="flex w-full items-center gap-3 p-4 text-left active:bg-slate-50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"><Icon name="user" className="h-[18px] w-[18px]" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-slate-900">{r.id} has no driver</span>
                    <span className="block text-xs text-slate-500">No on-duty driver was available · {r.total} pickups</span>
                  </span>
                  <span className="text-xs font-semibold text-brand-orange">Assign</span>
                </button>
              ))}
              {o.exceptionList.map(({ pickup, prs }) => {
                const d = o.drivers.find((x) => x.driverId === prs.driverId)
                return (
                  <button key={pickup.id} onClick={() => navigate(`/prs/${prs.id}`)} className="flex w-full items-center gap-3 p-4 text-left active:bg-slate-50">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700"><Icon name="alert" className="h-[18px] w-[18px]" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">{pickup.client}</span>
                      <span className="block truncate text-xs text-slate-500">{pickup.exception.note || 'Exception reported'} · {d?.name || prs.id}</span>
                    </span>
                    <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                )
              })}
            </Card>
          </div>
        )}

        <div className="mt-6">
          <div className="px-4"><SectionTitle title="Your drivers" subtitle="Tap a driver to open their run sheet" action="View all" onAction={() => navigate('/drivers')} /></div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
            {o.drivers.map((d) => (
              <button
                key={d.driverId}
                onClick={() => d.prs && navigate(`/prs/${d.prs.id}`)}
                className="w-[168px] shrink-0 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm active:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`rounded-full p-[2px] ring-2 ${!d.onDuty ? 'ring-slate-300' : d.prs?.state === 'in_progress' ? 'ring-brand-orange' : 'ring-emerald-500'}`}><Avatar name={d.name} size="w-9 h-9" /></span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900">{d.name.split(' ')[0]}</span>
                    <span className="block truncate text-[11px] text-slate-500">{d.vehicle}</span>
                  </span>
                </div>
                {d.prs ? (
                  <>
                    <p className="mt-3 flex items-center justify-between text-xs"><span className="text-slate-500">{d.prs.id}</span><span className="font-semibold text-slate-900">{d.prs.done}/{d.prs.total}</span></p>
                    <ProgressBar pct={d.prs.pct} className="mt-1.5" />
                  </>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">{d.onDuty ? 'Available' : 'Off duty'} · no run sheet</p>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 px-4">
          <SectionTitle title="Active run sheets" subtitle={`${active.length} of ${o.prsList.length} run sheets need action today`} action="View all" onAction={() => navigate('/prs')} />
          <div className="space-y-3">
            {active.map((r) => <PrsCard key={r.id} prs={r} driver={o.drivers.find((d) => d.driverId === r.driverId)} onClick={() => navigate(`/prs/${r.id}`)} />)}
            {active.length === 0 && <Card className="p-6 text-center text-sm text-slate-500">All run sheets are completed.</Card>}
          </div>
        </div>
      </div>
      <PrimaryNav />
    </div>
  )
}
