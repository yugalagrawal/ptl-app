// Monoline icon set (24px grid, 1.75 stroke) — replaces emoji everywhere.
const P = {
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  list: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9z" /><path d="M9 12h6M9 16h4" /></>,
  truck: <><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  scan: <><path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3" /><path d="M4 12h16" /></>,
  route: <><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></>,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  navigate: <path d="M3 11l18-8-8 18-2-8z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  tag: <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></>,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  bell: <><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 004 0" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  box: <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>,
  warehouse: <><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-7h6v7" /></>,
  history: <><path d="M3 12a9 9 0 109-9" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></>,
  support: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" /></>,
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  pin: <><path d="M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  wallet: <><path d="M3 7a2 2 0 012-2h13v4" /><path d="M3 7v11a2 2 0 002 2h16V9H5a2 2 0 01-2-2z" /><path d="M16 14h2" /></>,
  chart: <path d="M4 20h16M7 20v-7M12 20V6M17 20v-10" />,
  bank: <><path d="M3 10l9-6 9 6" /><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  printer: <><path d="M7 9V3h10v6" /><path d="M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2" /><path d="M7 14h10v7H7z" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /><path d="M16 4.5a3.5 3.5 0 010 7M18 14.8c2.2.6 4 2.2 4 5.2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  userPlus: <><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3.5-6 7-6s7 2 7 6" /><path d="M19 8v6M16 11h6" /></>,
  swap: <><path d="M7 4L3 8l4 4" /><path d="M3 8h14" /><path d="M17 20l4-4-4-4" /><path d="M21 16H7" /></>,
}

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.75 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[name]}
    </svg>
  )
}
