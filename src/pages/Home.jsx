import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPickups, getActivePrs, startPickup, isReadyForMiniHub, isPickupDone, isPrsNotificationSeen, markPrsNotificationSeen, PICKUP_STATUS } from '../data/prs'
import { getPartner } from '../data/session'
import { useDrawer } from '../context/DrawerContext'
import BottomNav from '../components/BottomNav'
import StatusBadge from '../components/StatusBadge'
import HeaderActions from '../components/HelpCentre'
import Icon from '../components/Icon'
import { Avatar, Button, Card, EmptyState, Hero, HeroStat, InfoCallout, LinkButton, PrototypeTag, RibbonCard, SectionTitle, Tabs } from '../components/ui'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}


function ribbonTone(p) {
  if (p.exception) return 'danger'
  return p.status === PICKUP_STATUS.PENDING ? 'neutral' : 'progress'
}

function ribbonLabel(p, total) {
  if (p.exception) return 'Issue reported'
  return p.status === PICKUP_STATUS.PENDING ? `Not started · Stop ${p.sequence} of ${total}` : `In progress · Stop ${p.sequence} of ${total}`
}

function nextRouteFor(p) {
  if (p.status === PICKUP_STATUS.DETAILS_PENDING) return `/pickup/${p.id}/details`
  if (p.status === PICKUP_STATUS.LABEL_PENDING) return `/pickup/${p.id}/print-labels`
  if (p.status === PICKUP_STATUS.SCANNING) return `/pickup/${p.id}/scan`
  return `/pickup/${p.id}`
}

function ctaLabel(p) {
  if (p.status === PICKUP_STATUS.PENDING) return 'Start pickup'
  if (p.status === PICKUP_STATUS.DETAILS_PENDING) return 'Create docket'
  if (p.status === PICKUP_STATUS.LABEL_PENDING) return 'Print labels'
  if (p.status === PICKUP_STATUS.SCANNING) return `Continue scanning (${p.scannedCount}/${p.packagesCount})`
  return 'View pickup'
}

export default function Home() {
  const navigate = useNavigate()
  const drawer = useDrawer()
  const partner = getPartner()
  const prs = getActivePrs()
  const pickups = getPickups()
  const [filter, setFilter] = useState('all')
  const [bannerDismissed, setBannerDismissed] = useState(isPrsNotificationSeen())

  const greetingRow = (issueTo) => (
    <div className="flex items-center justify-between">
      <button onClick={() => drawer?.open()} className="flex min-w-0 items-center gap-3 text-left">
        <span className="rounded-full ring-2 ring-white/30"><Avatar name={partner?.name} size="w-11 h-11" /></span>
        <span className="min-w-0">
          <span className="block text-[13px] text-white/65">{greeting()}<PrototypeTag role="Driver" /></span>
          <span className="block truncate text-lg font-semibold leading-tight text-white">{partner?.name?.split(' ')[0] || 'Driver'}</span>
        </span>
      </button>
      <HeaderActions issueTo={issueTo} dark />
    </div>
  )

  if (!prs) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <Hero className="rounded-b-[28px] px-4 pb-7 pt-5">{greetingRow(null)}</Hero>
          <div className="mt-5 px-4">
            <Card>
              <EmptyState icon="list" title="No run sheet assigned yet" body="Your primary account will assign a run sheet to you. It will show up here as soon as it's ready." />
            </Card>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  const doneCount = pickups.filter(isPickupDone).length
  const awbTarget = pickups.reduce((s, p) => s + (p.packagesCount ?? p.packagesEstimate), 0)
  const awbScanned = pickups.reduce((s, p) => s + p.scannedCount, 0)
  const weightLeft = pickups.filter((p) => !isPickupDone(p)).reduce((s, p) => s + p.estWeightKg, 0)
  const pct = pickups.length ? Math.round((doneCount / pickups.length) * 100) : 0

  const currentStop = pickups.find((p) => !isPickupDone(p))
  const queue = pickups.filter((p) => p.id !== currentStop?.id)
  const shown = queue.filter((p) => (filter === 'pending' ? !isPickupDone(p) : filter === 'done' ? isPickupDone(p) : true))
  const readyForMiniHub = isReadyForMiniHub()
  const FILTERS = [
    { key: 'all', label: 'All', count: queue.length },
    { key: 'pending', label: 'Pending', count: queue.filter((p) => !isPickupDone(p)).length },
    { key: 'done', label: 'Done', count: queue.filter(isPickupDone).length },
  ]

  function handleCta() {
    if (currentStop.status === PICKUP_STATUS.PENDING) {
      startPickup(currentStop.id)
      navigate(`/pickup/${currentStop.id}/details`)
    } else {
      navigate(nextRouteFor(currentStop))
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto pb-6">
        <Hero className="rounded-b-[28px] px-4 pb-6 pt-5">
          {greetingRow(currentStop ? `/pickup/${currentStop.id}/exception` : null)}
          <button onClick={() => navigate('/route')} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-3 text-left active:bg-white/10">
            <span className="min-w-0">
              <span className="block text-[11px] font-medium text-amber-300">Active run sheet</span>
              <span className="block truncate text-[15px] font-semibold text-white">{prs.id} · {prs.hubName}</span>
            </span>
            <Icon name="chevronRight" className="h-5 w-5 shrink-0 text-white/65" />
          </button>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <HeroStat label="Pickups done" value={doneCount} sub={`/ ${pickups.length}`} />
            <HeroStat label="Packages scanned" value={awbScanned} sub={`/ ${awbTarget}`} />
            <HeroStat label="Weight left" value={weightLeft} sub="kg" />
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-brand-orange transition-all" style={{ width: `${pct}%` }} />
          </div>
        </Hero>

        {!bannerDismissed && (
          <div className="mx-4 mt-4 flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <InfoCallout>
                <p className="font-semibold text-slate-900">New run sheet assigned by LT</p>
                <p className="mt-0.5 text-xs text-slate-600">{prs.id} · {prs.hubName} · {pickups.length} pickups</p>
              </InfoCallout>
            </div>
            <button onClick={() => { markPrsNotificationSeen(); setBannerDismissed(true) }} aria-label="Dismiss" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 active:bg-slate-200"><Icon name="x" className="h-5 w-5" /></button>
          </div>
        )}

        {currentStop && (
          <div className="mt-6 px-4">
            <SectionTitle title="Up next" subtitle="Your current stop on this run sheet" />
            <RibbonCard tone={ribbonTone(currentStop)} label={ribbonLabel(currentStop, pickups.length)}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-base font-semibold text-slate-900">{currentStop.client}</p>
                  <StatusBadge pickup={currentStop} />
                </div>
                <p className="mt-1 text-[13px] text-slate-500">{currentStop.address}</p>

                <div className="mt-3 flex items-center gap-4 text-[13px] text-slate-600">
                  <span className="flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4 text-slate-400" />{currentStop.slot}</span>
                  <span className="flex items-center gap-1.5"><Icon name="box" className="h-4 w-4 text-slate-400" />{currentStop.packagesCount ?? currentStop.packagesEstimate} pkgs · {currentStop.estWeightKg} kg</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <LinkButton href={`tel:${currentStop.consignor.phone}`} icon="phone" block>Call</LinkButton>
                  <LinkButton href={`https://maps.google.com/?q=${encodeURIComponent(currentStop.address + ', ' + currentStop.city)}`} target="_blank" rel="noreferrer" icon="navigate" block>Navigate</LinkButton>
                </div>
                <Button onClick={handleCta} block className="mt-2">{ctaLabel(currentStop)}</Button>
              </div>
            </RibbonCard>
          </div>
        )}

        {!currentStop && readyForMiniHub && (
          <div className="mt-6 px-4">
            <Card className="p-4">
              <p className="text-sm font-semibold text-slate-900">All pickups completed</p>
              <p className="mt-0.5 text-[13px] text-slate-500">Drop the packages at the mini hub to finish this run sheet.</p>
              <Button onClick={() => navigate('/mini-hub-scan')} block className="mt-3">Drop at mini hub</Button>
            </Card>
          </div>
        )}

        <div className="mt-6 px-4">
          <SectionTitle
            title={currentStop ? 'Remaining stops' : 'Pickups'}
            subtitle={`${queue.filter((p) => !isPickupDone(p)).length} pickups left on this run sheet`}
          />
          <Tabs options={FILTERS} value={filter} onChange={setFilter} />

          {shown.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-slate-400">Nothing here.</p>
          ) : (
            <Card className="mt-3 divide-y divide-slate-100 overflow-hidden">
              {shown.map((p) => {
                const done = isPickupDone(p)
                return (
                  <button key={p.id} onClick={() => navigate(`/pickup/${p.id}`)} className="flex min-h-[56px] w-full items-center gap-3 p-3.5 text-left active:bg-slate-50">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${done ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-navy/10 text-brand-navy'}`}>
                      {done ? <Icon name="check" className="h-4 w-4" /> : p.sequence}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm font-medium ${done ? 'text-slate-500' : 'text-slate-900'}`}>{p.client}</span>
                      <span className="block truncate text-xs text-slate-500">{p.slot} · {p.packagesCount ?? p.packagesEstimate} pkgs</span>
                    </span>
                    <StatusBadge pickup={p} />
                    <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                )
              })}
            </Card>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
