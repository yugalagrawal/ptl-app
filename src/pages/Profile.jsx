import { useNavigate } from 'react-router-dom'
import { getPartner, logout, isPrimary } from '../data/session'
import { getPickups, isPickupDone } from '../data/prs'
import { getPartnerOverview } from './primary/shared'
import { getTeams } from '../data/directory'
import { useDrawer } from '../context/DrawerContext'
import BottomNav from '../components/BottomNav'
import PrimaryNav from '../components/PrimaryNav'
import Icon from '../components/Icon'
import { AccountRow, Avatar, Button, Card, Hero, HeroStat, SectionTitle } from '../components/ui'

export default function Profile() {
  const partner = getPartner()
  const navigate = useNavigate()
  const drawer = useDrawer()
  const primary = isPrimary()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  let stats
  let fleet = []
  if (primary) {
    const o = getPartnerOverview(partner.partnerId)
    fleet = o.drivers
    stats = [
      { label: 'Drivers', value: o.drivers.length, icon: 'users' },
      { label: 'Vehicles', value: o.drivers.length, icon: 'truck' },
      { label: 'Run sheets', value: o.prsList.length, icon: 'list' },
    ]
  } else {
    const mine = getPickups()
    stats = [
      { label: 'Pickups done', value: mine.filter(isPickupDone).length, icon: 'checkCircle' },
      { label: 'Packages scanned', value: mine.reduce((s, p) => s + p.scannedCount, 0), icon: 'scan' },
      { label: 'Exceptions', value: mine.filter((p) => p.exception).length, icon: 'alert' },
    ]
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto pb-6">
        <Hero className="px-4 pb-5 pt-3">
          <div className="flex items-center justify-between">
            <button onClick={() => drawer?.open()} aria-label="Open menu" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-white active:bg-white/10"><Icon name="menu" className="h-6 w-6" /></button>
            <h1 className="text-[17px] font-semibold text-white">{primary ? 'Account' : 'Profile'}</h1>
            <span className="w-10" />
          </div>
          <div className="mt-3 flex flex-col items-center text-center">
            <span className="rounded-full border-4 border-white/20"><Avatar name={primary ? partner?.org : partner?.name} size="w-24 h-24 !text-3xl" /></span>
            {primary ? (
              <>
                <p className="mt-3 text-xl font-semibold tracking-tight text-white">{partner?.org}</p>
                <p className="mt-0.5 text-[13px] text-white/70">Primary account</p>
                <p className="mt-1.5 max-w-full truncate text-xs text-white/55">{partner?.name} · {partner?.email}</p>
              </>
            ) : (
              <>
                <p className="mt-3 text-xl font-semibold uppercase tracking-wide text-white">{partner?.name}</p>
                <p className="mt-0.5 max-w-full truncate text-[13px] text-white/70">{partner?.email}</p>
                <p className="text-[13px] text-white/70">{partner?.org} · Driver</p>
              </>
            )}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {stats.map((s) => <HeroStat key={s.label} {...s} />)}
          </div>
        </Hero>

        <div className="mt-6 space-y-3 px-4">
          {primary && (
            <>
              <SectionTitle title="Vehicles" subtitle={`${fleet.length} vehicles in your fleet`} />
              <Card className="divide-y divide-slate-100 overflow-hidden">
                {fleet.map((d) => {
                  const status = !d.onDuty ? ['Off duty', 'bg-slate-100 text-slate-600 ring-slate-200'] : d.prs?.state === 'in_progress' ? ['On run', 'bg-orange-50 text-orange-700 ring-orange-200'] : d.prs ? ['Assigned', 'bg-sky-50 text-sky-700 ring-sky-200'] : ['Available', 'bg-emerald-50 text-emerald-700 ring-emerald-200']
                  return (
                    <div key={d.driverId} className="flex items-center gap-3 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon name="truck" className="h-5 w-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">{d.vehicle}</span>
                        <span className="block truncate text-xs text-slate-500">{d.name}{d.prs ? ` · ${d.prs.id}` : ''}</span>
                      </span>
                      <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${status[1]}`}>{status[0]}</span>
                    </div>
                  )
                })}
              </Card>
              <div className="h-1" />
            </>
          )}
          <SectionTitle title={primary ? 'Account details' : 'Account'} />
          {primary && <AccountRow title="Contact person" subtitle={partner?.name} icon="user" />}
          {partner?.vehicle && <AccountRow title="Vehicle" subtitle={partner.vehicle} icon="truck" />}
          {partner?.phone && <AccountRow title="Mobile number" subtitle={partner.phone} icon="phone" />}
          {!primary && <AccountRow title="Partner organisation" subtitle={partner?.org} icon="warehouse" />}
          {primary && <AccountRow title="Teams" subtitle="Group your drivers by area or hub" onClick={() => navigate('/teams')} />}
          <AccountRow title="Help & support" subtitle="support@letstransport.team" icon="support" href="mailto:support@letstransport.team" />
          <Button variant="secondary" block icon="logout" onClick={handleLogout} className="mt-3 !text-red-600">Log out</Button>
        </div>
      </div>
      {primary ? <PrimaryNav /> : <BottomNav />}
    </div>
  )
}
