import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPickup, reportException, EXCEPTION_TYPE, EXCEPTION_LABEL } from '../data/prs'
import TopBar from '../components/TopBar'
import { Button, ActionBar, Card } from '../components/ui'

const TYPES = [EXCEPTION_TYPE.FAILED, EXCEPTION_TYPE.DELAYED, EXCEPTION_TYPE.REATTEMPT, EXCEPTION_TYPE.OTHER]

export default function ReportException() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pickup = getPickup(id)
  const [type, setType] = useState(EXCEPTION_TYPE.DELAYED)
  const [note, setNote] = useState('')

  if (!pickup) return null

  function handleSubmit() {
    if (!note.trim()) return
    reportException(id, { type, note: note.trim() })
    navigate(`/pickup/${id}`)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Report Exception" back />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-900">{pickup.client}</p>
          <p className="text-xs text-slate-500 mt-0.5">{pickup.id} · Stop {pickup.sequence}</p>
        </Card>

        <div>
          <p className="mb-2 text-[13px] font-medium text-slate-700">What happened?</p>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`min-h-[44px] rounded-xl border px-2 text-sm font-medium transition-colors active:bg-slate-50 ${
                  type === t ? 'border-slate-900 bg-slate-900 text-white active:bg-slate-900' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                {EXCEPTION_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="exc-note" className="mb-1.5 block text-[13px] font-medium text-slate-700">Note</label>
          <textarea
            id="exc-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Add a short note — e.g. store was shut, consignee asked to reattempt tomorrow…"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
        </div>
      </div>

      <ActionBar>
        {!note.trim() && <p className="text-center text-xs text-slate-500">Add a note to submit</p>}
        <Button block onClick={handleSubmit} disabled={!note.trim()}>Submit report</Button>
      </ActionBar>
    </div>
  )
}
