import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPickups, getActivePrs, startPickup, isReadyForMiniHub, isPickupDone, PICKUP_STATUS } from '../data/prs'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import StatusBadge from '../components/StatusBadge'
import Icon from '../components/Icon'
import { Button, Card, EmptyState, LinkButton, RibbonCard, SectionTitle } from '../components/ui'

// Stylised schematic route (no maps SDK in the prototype): pins at
// hand-placed positions joined in planned sequence order.
function pinColor(pu) {
  if (pu.exception) return '#DC2626'
  if (isPickupDone(pu)) return '#059669'
  if (pu.status !== PICKUP_STATUS.PENDING) return '#D94F1C'
  return '#64748B'
}

function ribbonTone(p) {
  if (p.exception) return 'danger'
  return p.status === PICKUP_STATUS.PENDING ? 'neutral' : 'progress'
}

function ribbonLabel(p) {
  if (p.exception) return 'Issue reported'
  return p.status === PICKUP_STATUS.PENDING ? `Not started · Stop ${p.sequence}` : `In progress · Stop ${p.sequence}`
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
  return `Continue scanning (${p.scannedCount}/${p.packagesCount})`
}

export default function RoutePage() {
  const navigate = useNavigate()
  const prs = getActivePrs()
  const pickups = getPickups()
  const [showCompleted, setShowCompleted] = useState(false)

  if (!prs) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <TopBar title="Route" menu />
        <div className="flex-1 px-4 pt-4"><Card><EmptyState icon="route" title="No route yet" body="Your route appears once a run sheet is assigned to you." /></Card></div>
        <BottomNav />
      </div>
    )
  }

  const pathD = pickups.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.mapX} ${p.mapY}`).join(' ')
  const completed = pickups.filter(isPickupDone)
  const currentStop = pickups.find((p) => !isPickupDone(p))
  const upcoming = pickups.filter((p) => !isPickupDone(p) && p.id !== currentStop?.id)

  function handleCta() {
    if (currentStop.status === PICKUP_STATUS.PENDING) {
      startPickup(currentStop.id)
      navigate(`/pickup/${currentStop.id}/details`)
    } else navigate(nextRouteFor(currentStop))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Route" subtitle={`${prs.id} · ${prs.hubName} · ${pickups.length} stops`} menu />
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <Card className="overflow-hidden">
          <div className="relative bg-slate-50" style={{ aspectRatio: '10 / 11' }}>
            <svg viewBox="0 0 100 110" className="absolute inset-0 h-full w-full">
              <path d={pathD} fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 2.5" />
              {pickups.map((p) => (
                <g key={p.id} onClick={() => navigate(`/pickup/${p.id}`)} className="cursor-pointer">
                  <circle cx={p.mapX} cy={p.mapY} r="4.2" fill={pinColor(p)} stroke="white" strokeWidth="1" />
                  <text x={p.mapX} y={p.mapY + 1.4} textAnchor="middle" fontSize="4.2" fontWeight="600" fill="white">{p.sequence}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-3.5 py-2.5 text-[11px] text-slate-500">
            {[['bg-slate-500', 'Pending'], ['bg-brand-orange', 'In progress'], ['bg-emerald-600', 'Done'], ['bg-red-600', 'Exception']].map(([c, l]) => (
              <span key={l} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${c}`} />{l}</span>
            ))}
          </div>
        </Card>

        {currentStop && (
          <div className="mt-6">
            <SectionTitle title="Next stop" subtitle="Head here after your current task" />
            <RibbonCard tone={ribbonTone(currentStop)} label={ribbonLabel(currentStop)}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-base font-semibold text-slate-900">{currentStop.client}</p>
                  <StatusBadge pickup={currentStop} />
                </div>
                <p className="mt-1 text-[13px] text-slate-500">{currentStop.address}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-slate-600"><Icon name="clock" className="h-4 w-4 text-slate-400" />{currentStop.slot} · {currentStop.consignor.name}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <LinkButton href={`tel:${currentStop.consignor.phone}`} icon="phone" block>Call</LinkButton>
                  <LinkButton href={`https://maps.google.com/?q=${encodeURIComponent(currentStop.address + ', ' + currentStop.city)}`} target="_blank" rel="noreferrer" icon="navigate" block>Navigate</LinkButton>
                </div>
                <Button onClick={handleCta} block className="mt-2">{ctaLabel(currentStop)}</Button>
              </div>
            </RibbonCard>
          </div>
        )}

        {!currentStop && isReadyForMiniHub() && (
          <Card className="mt-6 p-4">
            <p className="text-sm font-semibold text-slate-900">All pickups completed</p>
            <Button onClick={() => navigate('/mini-hub-scan')} block className="mt-3">Drop at mini hub</Button>
          </Card>
        )}

        {upcoming.length > 0 && (
          <div className="mt-6">
            <SectionTitle title="Upcoming stops" subtitle={`${upcoming.length} more on this route`} />
            <Card className="divide-y divide-slate-100 overflow-hidden">
              {upcoming.map((pu) => (
                <button key={pu.id} onClick={() => navigate(`/pickup/${pu.id}`)} className="flex w-full items-center gap-3 p-3.5 text-left active:bg-slate-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-[13px] font-semibold text-brand-navy">{pu.sequence}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">{pu.client}</span>
                    <span className="block truncate text-xs text-slate-500">{pu.address}</span>
                  </span>
                  <StatusBadge pickup={pu} />
                  <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-300" />
                </button>
              ))}
            </Card>
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-5">
            <button onClick={() => setShowCompleted((v) => !v)} className="flex w-full items-center justify-center gap-1 py-1 text-[13px] font-medium text-slate-500">
              {showCompleted ? 'Hide' : 'Show'} {completed.length} completed stop{completed.length === 1 ? '' : 's'}
              <Icon name="chevronDown" className={`h-4 w-4 transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
            </button>
            {showCompleted && (
              <Card className="mt-2 divide-y divide-slate-100 overflow-hidden">
                {completed.map((pu) => (
                  <button key={pu.id} onClick={() => navigate(`/pickup/${pu.id}`)} className="flex w-full items-center gap-3 p-3.5 text-left active:bg-slate-50">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Icon name="check" className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-500">{pu.client}</span>
                      <span className="block truncate text-xs text-slate-400">{pu.docketNumber}</span>
                    </span>
                  </button>
                ))}
              </Card>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
