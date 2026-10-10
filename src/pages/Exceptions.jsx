import { useNavigate } from 'react-router-dom'
import { getPickups, EXCEPTION_LABEL, EXCEPTION_BADGE } from '../data/prs'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import Icon from '../components/Icon'
import { Card, EmptyState, SectionTitle } from '../components/ui'

export default function Exceptions() {
  const navigate = useNavigate()
  const flagged = getPickups().filter((p) => p.exception)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Exceptions" menu />
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {flagged.length === 0 ? (
          <Card><EmptyState icon="checkCircle" title="No exceptions reported" body="Failed, delayed or reattempt pickups on this run will show up here." /></Card>
        ) : (
          <>
            <SectionTitle title="Reported issues" subtitle={`${flagged.length} pickup${flagged.length === 1 ? '' : 's'} flagged on this run`} />
            <div className="space-y-3">
              {flagged.map((pu) => (
                <button key={pu.id} onClick={() => navigate(`/pickup/${pu.id}`)} className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left active:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-[15px] font-semibold text-slate-900">{pu.client}</p>
                    <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${EXCEPTION_BADGE[pu.exception.type]}`}>{EXCEPTION_LABEL[pu.exception.type]}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{pu.id} · Stop {pu.sequence} · Reported {pu.exception.at}</p>
                  <p className="mt-2 text-sm text-slate-700">{pu.exception.note}</p>
                  <span className="mt-3 flex items-center gap-0.5 text-[13px] font-semibold text-brand-orange">View details<Icon name="chevronRight" className="h-4 w-4" /></span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
