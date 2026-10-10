import flowLogo from '../assets/flow-logo-light.svg'

// Full-screen branded loader: a truck drives along a road, pulling a progress
// bar behind it. `duration` (ms) drives the whole animation; the parent decides
// when to unmount.
function Wheel({ cx }) {
  return (
    <g transform={`translate(${cx} 36)`}>
      <circle r="6.5" fill="#0B1424" />
      <g className="flow-wheel">
        <circle r="3.4" fill="#93A4C3" />
        <path d="M0-3.4V3.4M-3.4 0H3.4" stroke="#0B1424" strokeWidth="1.2" />
      </g>
    </g>
  )
}

function Truck() {
  return (
    <svg viewBox="0 0 96 46" className="h-full w-full overflow-visible" aria-hidden="true">
      <g className="flow-truck-bounce">
        {/* cargo box */}
        <rect x="1" y="5" width="58" height="29" rx="3.5" fill="#1A2B4A" />
        <rect x="1" y="22" width="58" height="5" fill="#FB6B24" />
        <rect x="1" y="27" width="58" height="2.5" fill="#D94423" />
        <rect x="7" y="10" width="11" height="8" rx="2" fill="#FFFFFF" opacity="0.12" />
        {/* cab */}
        <path d="M62 12h14.5c1.6 0 3 .8 3.9 2.1L88 25.5c.6.9.9 1.9.9 3V34H62z" fill="#FB6B24" />
        <path d="M66 15.5h9.4c.9 0 1.7.4 2.2 1.1l4.2 6.4H66z" fill="#1A2B4A" />
        <path d="M66 15.5h9.4c.9 0 1.7.4 2.2 1.1l.6.9H66z" fill="#FFFFFF" opacity="0.18" />
        <rect x="86" y="27" width="4" height="4" rx="1" fill="#FFE08A" />
        <rect x="58" y="30" width="32" height="4.5" rx="1.5" fill="#AD351A" />
        <Wheel cx={14} />
        <Wheel cx={34} />
        <Wheel cx={74} />
      </g>
    </svg>
  )
}

export default function TruckLoader({ duration = 2400, label = 'Loading your world' }) {
  const style = { animationDuration: `${duration}ms` }
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center overflow-hidden bg-white px-8 pb-12 pt-10 text-brand-navy">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(110% 50% at 50% -10%, rgba(251,107,36,0.12) 0, transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #F3F5F9 100%)',
        }}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center">
        <img src={flowLogo} alt="FLOW by LetsTransport" className="h-auto w-[176px]" />
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          Freight &amp; Logistics Operating World
        </p>
      </div>

      <div className="relative w-full">
        {/* skyline-ish speed lines */}
        <div className="flow-speed pointer-events-none absolute -top-10 left-0 right-0 h-8 opacity-40" />

        {/* truck rides the head of the progress bar */}
        <div className="relative h-14">
          <div className="flow-truck absolute bottom-0 h-14 w-[104px]" style={style}>
            <Truck />
          </div>
        </div>

        {/* road + progress */}
        <div className="relative h-[10px] w-full rounded-full bg-slate-200">
          <div className="flow-fill absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#D94423] to-[#FB6B24] shadow-[0_0_12px_rgba(251,107,36,0.45)]" style={style} />
        </div>
        <div className="flow-road mt-2 h-[2px] w-full opacity-40" />

        <p className="mt-6 text-center text-[13px] font-medium tracking-wide text-slate-500">
          {label}
          <span className="flow-dots" />
        </p>
      </div>
    </div>
  )
}
