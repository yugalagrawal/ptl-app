import Icon from './Icon'

// ---- Design system: restrained, enterprise. One orange primary action per
// screen; everything else is neutral. Colour is reserved for status. ----

const BTN = {
  primary: 'bg-brand-orange text-white shadow-sm active:bg-brand-orange-dark disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none',
  secondary: 'bg-white text-slate-800 border border-slate-300 active:bg-slate-50 disabled:text-slate-400',
  ghost: 'text-brand-orange active:bg-orange-50',
  danger: 'text-red-600 active:bg-red-50',
}
const BTN_SIZE = { lg: 'h-12 px-5 text-[15px]', md: 'h-10 px-4 text-sm', sm: 'h-8 px-3 text-xs' }

export function Button({ variant = 'primary', size = 'lg', icon, block, className = '', children, ...rest }) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors ${BTN[variant]} ${BTN_SIZE[size]} ${block ? 'w-full' : ''} ${className}`}
    >
      {icon && <Icon name={icon} className={size === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]'} />}
      {children}
    </button>
  )
}

// Same look as Button but for <a> (tel:, maps).
export function LinkButton({ variant = 'secondary', size = 'md', icon, block, className = '', children, ...rest }) {
  return (
    <a
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors ${BTN[variant]} ${BTN_SIZE[size]} ${block ? 'w-full' : ''} ${className}`}
    >
      {icon && <Icon name={icon} className={size === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]'} />}
      {children}
    </a>
  )
}

export function Card({ className = '', children, ...rest }) {
  return (
    <div {...rest} className={`rounded-2xl border border-slate-200 bg-white ${className}`}>
      {children}
    </div>
  )
}

// Tappable card row — chevron signals it opens something.
export function RowCard({ onClick, className = '', children }) {
  return (
    <button onClick={onClick} className={`w-full text-left rounded-2xl border border-slate-200 bg-white p-4 transition active:bg-slate-50 ${className}`}>
      {children}
    </button>
  )
}

export const TONE = {
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  warn: 'bg-amber-50 text-amber-700 ring-amber-200',
  progress: 'bg-orange-50 text-orange-700 ring-orange-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
}

export function Chip({ tone = 'neutral', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${TONE[tone]} ${className}`}>
      {children}
    </span>
  )
}

const AVATAR_COLORS = ['bg-brand-orange', 'bg-brand-navy', 'bg-teal-700', 'bg-violet-700', 'bg-rose-700', 'bg-amber-700']
function avatarColor(name = '') {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 997
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export function Avatar({ name, size = 'w-10 h-10', unassigned = false }) {
  const initials = (name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <span className={`${size} shrink-0 rounded-full flex items-center justify-center text-[13px] font-semibold ${unassigned ? 'border border-dashed border-slate-300 bg-white text-slate-400' : `${avatarColor(name)} text-white`}`}>
      {unassigned ? <Icon name="user" className="w-4 h-4" /> : initials}
    </span>
  )
}

export function ProgressBar({ pct, className = '' }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className="h-full rounded-full bg-brand-orange transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function SectionHeader({ title, action, onAction, count }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
        {title}{count != null && <span className="ml-1.5 text-slate-400">{count}</span>}
      </h2>
      {action && <button onClick={onAction} className="text-[13px] font-semibold text-brand-orange">{action}</button>}
    </div>
  )
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="flex rounded-xl bg-slate-100 p-1 text-[13px] font-medium">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`flex-1 rounded-lg py-1.5 text-center transition ${value === o.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({ icon, title, body }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
      {body && <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-slate-500">{body}</p>}
    </div>
  )
}

// Fixed action area at the bottom of a screen: one primary action, optional
// secondary/tertiary beneath.
export function ActionBar({ children }) {
  return <div className="shrink-0 space-y-2 border-t border-slate-200 bg-white px-4 py-3">{children}</div>
}

export function Field({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  )
}

export function Switch({ on, disabled, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-emerald-600' : 'bg-slate-300'} ${disabled ? 'opacity-40' : ''}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

export function TextField({ label, error, ...rest }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</span>
      <input
        {...rest}
        className={`h-11 w-full rounded-xl border bg-white px-3 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 ${error ? 'border-red-400' : 'border-slate-300'}`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}

export function PrototypeTag({ role }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 align-middle text-[10px] font-medium text-white">
      Prototype for: {role}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Dashboard patterns (hero header, stat tiles, ribbon cards, tabs, callouts)
// ---------------------------------------------------------------------------

// Plain brand navy with a barely-there vertical gradient.
export function Hero({ className = '', children }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-brand-navy to-[#15233d] text-white ${className}`}>
      <div className="relative">{children}</div>
    </div>
  )
}

// Translucent tile that sits on a Hero: coloured caption, big value.
export function HeroStat({ label, value, sub, icon, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3 text-center active:bg-white/10">
      <p className="text-[11px] font-medium text-amber-300">{label}</p>
      <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xl font-semibold text-white">
        {icon && <Icon name={icon} className="h-4 w-4 text-orange-300" />}
        {value}
        {sub && <span className="text-xs font-normal text-white/50">{sub}</span>}
      </p>
    </Tag>
  )
}

// Detail-screen header: gradient, centered title, optional icon medallion
// overlapping the bottom edge. Reserve `mb-8` below when `icon` is used.
export function HeroHeader({ title, subtitle, back, onBack, right, icon }) {
  return (
    <div className={`shrink-0 ${icon ? 'mb-7' : ''}`}>
      <Hero className={`rounded-b-[28px] px-4 pt-3 ${icon ? "pb-11" : "pb-5"}`}>
        <div className="flex min-h-[40px] items-center justify-between">
          {back ? (
            <button onClick={onBack} aria-label="Back" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-white active:bg-white/10">
              <Icon name="chevronLeft" className="h-6 w-6" />
            </button>
          ) : <span className="w-10" />}
          <div className="min-w-0 flex-1 px-2 text-center">
            <h1 className="truncate text-[17px] font-semibold text-white">{title}</h1>
            {subtitle && <p className="truncate text-xs text-white/65">{subtitle}</p>}
          </div>
          <span className="flex w-10 justify-end">{right}</span>
        </div>
      </Hero>
      {icon && (
        <span className="relative -mt-7 mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#F3F4F6] bg-white text-brand-navy shadow">
          <Icon name={icon} className="h-6 w-6" />
        </span>
      )}
    </div>
  )
}

const RIBBON = {
  success: 'bg-emerald-600',
  progress: 'bg-brand-orange',
  neutral: 'bg-brand-navy',
  danger: 'bg-red-600',
  info: 'bg-sky-600',
}

// Card with a coloured status tab across the top (status readable at a glance).
export function RibbonCard({ tone = 'neutral', label, onClick, children, className = '' }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className={`block w-full overflow-hidden rounded-2xl border border-slate-200 text-left shadow-sm ${RIBBON[tone]} ${onClick ? 'active:opacity-95' : ''} ${className}`}>
      <p className="px-4 pb-2.5 pt-1.5 text-center text-xs font-medium text-white">{label}</p>
      <div className="-mt-2 rounded-t-2xl bg-white">{children}</div>
    </Tag>
  )
}

// Underline tabs (scrollable) for filtering a list.
export function Tabs({ options, value, onChange }) {
  return (
    <div className="flex overflow-x-auto border-b border-slate-200 no-scrollbar">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`relative shrink-0 px-4 py-2.5 text-[14px] ${value === o.key ? 'font-semibold text-slate-900' : 'text-slate-500'}`}
        >
          {o.label}{o.count != null && <span className="ml-1.5 text-xs text-slate-400">{o.count}</span>}
          {value === o.key && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-t bg-brand-orange" />}
        </button>
      ))}
    </div>
  )
}

export function InfoCallout({ children }) {
  return (
    <div className="flex gap-3 rounded-2xl border-[1.5px] border-sky-300 bg-sky-50 p-3.5 text-[13px] leading-relaxed text-slate-700">
      <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
      <div>{children}</div>
    </div>
  )
}

export function SectionTitle({ title, subtitle, action, onAction }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p>}
      </div>
      {action && <button onClick={onAction} className="pb-0.5 text-[13px] font-semibold text-brand-orange">{action}</button>}
    </div>
  )
}

// Outlined "label ... value" tile used in summaries.
export function StatBox({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{value}{sub && <span className="text-sm font-normal text-slate-400"> {sub}</span>}</p>
    </div>
  )
}

// Grey "label ... #value" row (ranking style).
export function RankRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  )
}

// Account-style list card: bold title, muted subtitle, trailing icon.
export function AccountRow({ title, subtitle, icon = 'chevronRight', onClick, href }) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-slate-900">{title}</span>
        {subtitle && <span className="mt-0.5 block text-[13px] text-slate-500">{subtitle}</span>}
      </span>
      <Icon name={icon} className="h-5 w-5 shrink-0 text-slate-500" />
    </>
  )
  const cls = 'flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left active:bg-slate-50'
  return href ? <a href={href} className={cls}>{body}</a> : <button onClick={onClick} className={cls}>{body}</button>
}
