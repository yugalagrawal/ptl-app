import { PICKUP_STATUS, PICKUP_STATUS_LABEL, PICKUP_STATUS_BADGE, EXCEPTION_LABEL, EXCEPTION_BADGE } from '../data/prs'

// A reported exception overrides the lifecycle label — it's the more useful
// thing to see at a glance. Mid-scan shows a live "3/10 scanned" count.
export default function StatusBadge({ pickup }) {
  if (!pickup) return null
  const base = 'inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium'

  if (pickup.exception) {
    return <span className={`${base} ${EXCEPTION_BADGE[pickup.exception.type]}`}>{EXCEPTION_LABEL[pickup.exception.type]}</span>
  }
  if (pickup.status === PICKUP_STATUS.SCANNING) {
    return <span className={`${base} ${PICKUP_STATUS_BADGE.scanning}`}>{pickup.scannedCount}/{pickup.packagesCount} scanned</span>
  }
  return <span className={`${base} ${PICKUP_STATUS_BADGE[pickup.status]}`}>{PICKUP_STATUS_LABEL[pickup.status]}</span>
}
