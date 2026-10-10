import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'

// Header actions (help + notifications) with the Help Centre sheet. Pass
// `issueTo` (a route) to offer "Report a pickup issue" for the current stop.
export default function HeaderActions({ issueTo, dark = false }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const btn = `flex h-10 w-10 items-center justify-center rounded-full border ${dark ? 'border-white/20 bg-white/10 text-white active:bg-white/20' : 'border-slate-200 bg-white text-slate-600 active:bg-slate-50'}`

  return (
    <>
      <div className="flex items-center gap-2">
        <button className={btn} aria-label="Help centre" onClick={() => setOpen(true)}><Icon name="support" /></button>
        <button className={btn} aria-label="Notifications"><Icon name="bell" /></button>
      </div>

      {open && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-slate-900/40">
          <button type="button" aria-label="Close" className="flex-1" onClick={() => setOpen(false)} />
          <div className="rounded-t-3xl bg-white px-4 pb-8 pt-3">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Help Centre</h2>
                <p className="mt-0.5 text-[13px] text-slate-500">How can we help?</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-slate-400"><Icon name="x" /></button>
            </div>
            <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
              {issueTo && (
                <button onClick={() => { setOpen(false); navigate(issueTo) }} className="flex w-full items-center gap-3 p-3.5 text-left active:bg-slate-50">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"><Icon name="alert" className="w-[18px] h-[18px]" /></span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-900">Report an issue with this pickup</span>
                    <span className="block text-xs text-slate-500">Customer unavailable, delay, wrong address</span>
                  </span>
                  <Icon name="chevronRight" className="w-4 h-4 text-slate-400" />
                </button>
              )}
              <a href="mailto:support@letstransport.team" className="flex w-full items-center gap-3 p-3.5 text-left active:bg-slate-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"><Icon name="support" className="w-[18px] h-[18px]" /></span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-slate-900">Contact LT Support</span>
                  <span className="block text-xs text-slate-500">support@letstransport.team</span>
                </span>
                <Icon name="chevronRight" className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
