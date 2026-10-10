import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPickup, startPickup, clearException, isPickupDone, PICKUP_STATUS, EXCEPTION_LABEL, EXCEPTION_BADGE } from '../data/prs'
import TopBar from '../components/TopBar'
import { HeroHeader } from '../components/ui'
import StatusBadge from '../components/StatusBadge'
import Icon from '../components/Icon'
import { ActionBar, Button, Card, Field, LinkButton, ProgressBar, SectionTitle, StatBox } from '../components/ui'

export default function PickupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pickup = getPickup(id)
  // Module state is mutated in place; bump to re-render (navigate(0) would wipe the mock session).
  const [, bump] = useState(0)

  if (!pickup) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <TopBar title="Not found" back />
        <p className="p-4 text-sm text-slate-500">Pickup not found.</p>
      </div>
    )
  }

  const isDone = isPickupDone(pickup)
  const captured = pickup.status !== PICKUP_STATUS.PENDING && pickup.status !== PICKUP_STATUS.DETAILS_PENDING
  const pct = pickup.packagesCount ? Math.round((pickup.scannedCount / pickup.packagesCount) * 100) : 0

  function handleStart() {
    startPickup(id)
    navigate(`/pickup/${id}/details`)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeroHeader title={pickup.client} subtitle={`${pickup.id} · Stop ${pickup.sequence}`} back onBack={() => navigate(-1)} icon="box" />
      <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <StatusBadge pickup={pickup} />
          {pickup.docketNumber && <span className="text-xs font-medium text-slate-500">Docket {pickup.docketNumber}</span>}
        </div>

        {pickup.exception && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${EXCEPTION_BADGE[pickup.exception.type]}`}>{EXCEPTION_LABEL[pickup.exception.type]}</span>
                <p className="mt-1.5 text-sm text-red-900">{pickup.exception.note}</p>
                <p className="mt-0.5 text-xs text-red-700">Reported {pickup.exception.at}</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => { clearException(id); bump((n) => n + 1) }}>Clear</Button>
            </div>
          </div>
        )}

        <Card className="p-4">
          <p className="flex items-start gap-2 text-sm text-slate-700"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{pickup.address}, {pickup.city} {pickup.pincode}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <StatBox label="Slot" value={pickup.slot} />
            <StatBox label="Est. packages" value={pickup.packagesEstimate} />
            <StatBox label="Est. weight" value={pickup.estWeightKg} sub="kg" />
            <StatBox label="Stop" value={pickup.sequence} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <LinkButton href={`tel:${pickup.consignor.phone}`} icon="phone" block>Call {pickup.consignor.name.split(' ')[0]}</LinkButton>
            <LinkButton href={`https://maps.google.com/?q=${encodeURIComponent(pickup.address + ', ' + pickup.city)}`} target="_blank" rel="noreferrer" icon="navigate" block>Navigate</LinkButton>
          </div>
        </Card>

        {pickup.docketNumber && (
          <Card className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-slate-500">Docket</p>
              <p className="text-sm font-semibold text-slate-900">{pickup.docketNumber}</p>
            </div>
            <span className="text-xs text-slate-500">{pickup.status === PICKUP_STATUS.LABEL_PENDING ? 'Awaiting labels' : `${pickup.packagesCount} pkgs · ${pickup.actualWeightKg} kg`}</span>
          </Card>
        )}

        {captured && (
          <div>
            <SectionTitle title="Captured on site" subtitle="Details recorded at the pickup location" />
            <Card className="divide-y divide-slate-100 px-4">
              <Field label="Consignee" value={pickup.consignee?.company} />
              <Field label="Contact" value={`${pickup.consignee?.name} · ${pickup.consignee?.phone}`} />
              <Field label="Actual weight" value={`${pickup.actualWeightKg} kg`} />
              <Field label="Volumetric weight" value={`${pickup.volumetricWeightKg} kg`} />
              <Field label="Packages" value={pickup.packagesCount} />
            </Card>
          </div>
        )}

        {(pickup.status === PICKUP_STATUS.SCANNING || isDone) && (
          <div>
            <SectionTitle title="Scanning" subtitle="Packages scanned against the docket" />
            <Card className="p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">Packages scanned</span>
                <span className="text-lg font-bold text-slate-900">{pickup.scannedCount}/{pickup.packagesCount}</span>
              </div>
              <ProgressBar pct={pct} />
            </Card>
          </div>
        )}
      </div>

      <ActionBar>
        {pickup.status === PICKUP_STATUS.PENDING && <Button block onClick={handleStart}>Start pickup</Button>}
        {pickup.status === PICKUP_STATUS.DETAILS_PENDING && <Button block onClick={() => navigate(`/pickup/${id}/details`)}>Create docket</Button>}
        {pickup.status === PICKUP_STATUS.LABEL_PENDING && <Button block onClick={() => navigate(`/pickup/${id}/print-labels`)}>Print labels</Button>}
        {pickup.status === PICKUP_STATUS.SCANNING && <Button block onClick={() => navigate(`/pickup/${id}/scan`)}>Continue scanning ({pickup.scannedCount}/{pickup.packagesCount})</Button>}
        {pickup.status === PICKUP_STATUS.PICKED_UP && <p className="py-2 text-center text-sm font-medium text-emerald-700">Picked up — ready for mini hub drop</p>}
        {pickup.status === PICKUP_STATUS.REACHED_MINI_HUB && <p className="py-2 text-center text-sm font-medium text-violet-700">Reached mini hub</p>}
        {!isDone && <Button variant="danger" size="md" block icon="alert" onClick={() => navigate(`/pickup/${id}/exception`)}>Report an issue</Button>}
      </ActionBar>
    </div>
  )
}
