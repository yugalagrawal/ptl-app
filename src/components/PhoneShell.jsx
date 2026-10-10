import { useEffect, useState } from 'react'

// iPhone 18 Pro Max frame (440 x 956 pt screen). Every app screen renders inside
// it; the frame scales down to fit short browser windows.
const SCREEN_W = 440
const SCREEN_H = 956
const BEZEL = 12
const FRAME_H = SCREEN_H + BEZEL * 2

function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex h-[54px] items-center justify-between px-9 text-white mix-blend-difference">
      <span className="text-[16px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 4.2a10 10 0 0115 0M3.6 7a6.3 6.3 0 019.8 0"/><circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none"/></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" opacity="0.5"/><rect x="2" y="2" width="19" height="9" rx="2.2" fill="currentColor"/><path d="M24.5 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" fill="currentColor" opacity="0.5"/></svg>
      </div>
    </div>
  )
}

export default function PhoneShell({ children }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 24) / FRAME_H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-slate-200">
      <div style={{ transform: `scale(${scale})`, flexShrink: 0 }}>
        <div
          className="relative rounded-[68px] bg-[#1c1c1e] shadow-[0_30px_80px_-20px_rgba(15,23,42,0.5)] ring-1 ring-black/40"
          style={{ width: SCREEN_W + BEZEL * 2, height: FRAME_H, padding: BEZEL }}
        >
          {/* side buttons */}
          <span className="absolute -left-[3px] top-[150px] h-8 w-[3px] rounded-l bg-[#2a2a2c]" />
          <span className="absolute -left-[3px] top-[210px] h-14 w-[3px] rounded-l bg-[#2a2a2c]" />
          <span className="absolute -left-[3px] top-[280px] h-14 w-[3px] rounded-l bg-[#2a2a2c]" />
          <span className="absolute -right-[3px] top-[240px] h-24 w-[3px] rounded-r bg-[#2a2a2c]" />

          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[56px] bg-[#F3F4F6] pb-[22px] pt-[54px]">
            {children}
            <StatusBar />
            <div className="absolute left-1/2 top-[11px] z-[70] h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-black" />
            <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-[60] h-[5px] w-[140px] -translate-x-1/2 rounded-full bg-slate-900/80 mix-blend-difference" />
          </div>
        </div>
      </div>
    </div>
  )
}
