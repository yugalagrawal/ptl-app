import Icon from '../../components/Icon'
import { Avatar, ProgressBar, RibbonCard } from '../../components/ui'

const RIBBON = {
  unassigned: ['danger', 'Needs a driver'],
  not_started: ['neutral', 'Not started'],
  in_progress: ['progress', 'In progress'],
  completed: ['success', 'Completed'],
}

// Run-sheet card: status tab on top, id + hub, driver, progress, link.
export default function PrsCard({ prs, driver, onClick }) {
  const [tone, label] = RIBBON[prs.state]
  return (
    <RibbonCard tone={tone} label={label} onClick={onClick}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-semibold text-slate-900">{prs.id}</p>
            <p className="truncate text-[13px] text-slate-500">{prs.hubName}</p>
          </div>
          {prs.exceptions > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 ring-1 ring-inset ring-red-200">
              <Icon name="alert" className="h-3 w-3" />{prs.exceptions}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
          <Avatar name={driver?.name} unassigned={!driver} size="w-8 h-8" />
          <p className="min-w-0 flex-1 truncate text-[13px] text-slate-700">
            {driver ? <>{driver.name} <span className="text-slate-400">· {driver.vehicle}</span></> : <span className="text-slate-500">No driver assigned</span>}
          </p>
        </div>

        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">{prs.total} pickups · {prs.weightKg} kg</span>
            <span className="font-semibold text-slate-900">{prs.done}/{prs.total}</span>
          </div>
          <ProgressBar pct={prs.pct} />
        </div>

        <p className="mt-3 flex items-center text-[13px] font-semibold text-brand-orange">
          View details <Icon name="chevronRight" className="ml-0.5 h-4 w-4" />
        </p>
      </div>
    </RibbonCard>
  )
}
