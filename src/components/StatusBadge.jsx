const STYLES = {
  pending: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-amber-100 text-amber-700',
  docket_created: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

const LABELS = {
  pending: 'Pending',
  in_progress: 'In progress',
  docket_created: 'Docket created',
  completed: 'Completed',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STYLES[status] || STYLES.pending}`}>
      {LABELS[status] || status}
    </span>
  )
}
