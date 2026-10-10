import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAs } from '../data/session'
import { detectIdentity, ROLE_LABELS, PARTNER_USERS, ACCOUNT_ROLE_LABEL } from '../data/directory'
import { Avatar, Chip } from '../components/ui'
import SharedIcon from '../components/Icon'
import TruckLoader from '../components/TruckLoader'
import flowLogo from '../assets/flow-logo-light.svg'

const DEMO_OTP = '123456'

const ROLE_BADGE_STYLE = {
  lt: 'bg-sky-50 text-sky-700 ring-sky-200',
  partner: 'bg-orange-50 text-brand-orange-dark ring-orange-200',
  client: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

const INPUT =
  'w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-[16px] text-brand-navy placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10'
const LABEL = 'mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-600'
const CTA =
  'flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(217,79,28,0.55)] transition active:scale-[0.98] disabled:opacity-45 disabled:shadow-none'

const GOOGLE = {
  name: 'Google',
  icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5.05 5.05 0 01-2.19 3.31v2.75h3.55c2.08-1.91 3.24-4.73 3.24-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.75c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.55H2.17v2.84A11 11 0 0012 23z" />
        <path fill="#FBBC05" d="M5.83 14.1a6.6 6.6 0 010-4.2V7.06H2.17a11 11 0 000 9.88l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.35c1.62 0 3.07.56 4.21 1.65l3.15-3.15A10.6 10.6 0 0012 1 11 11 0 002.17 7.06l3.66 2.84C6.7 7.29 9.13 5.35 12 5.35z" />
      </svg>
  ),
}

const Icon = ({ children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
    {children}
  </svg>
)

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [step, setStep] = useState('identify') // 'identify' | 'otp'
  const [sso, setSso] = useState(null) // null | { step: 'redirecting' | 'accounts', provider }
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const navigate = useNavigate()

  const { role, match } = useMemo(() => detectIdentity(identifier), [identifier])
  const isRegistered = role && role !== 'unregistered'

  function completeLogin(over) {
    const r = over?.role ?? role
    loginAs(r, over?.match ?? match, over?.id ?? identifier.trim())
    setSso(null)
    setSigningIn(true)
    setTimeout(() => navigate(r === 'partner' ? '/home' : '/not-available'), 1700)
  }

  function handleSendOtp(e) {
    e.preventDefault()
    if (!isRegistered) return
    setOtp('')
    setOtpError('')
    setStep('otp')
  }

  function pickProvider(provider) {
    setSso({ step: 'redirecting', provider })
    setTimeout(() => setSso((cur) => (cur ? { step: 'accounts', provider } : cur)), 1400)
  }

  function pickAccount(u) {
    const { role: r, match: m } = detectIdentity(u.email)
    completeLogin({ role: r, match: m, id: u.email })
  }

  function handleChangeIdentifier() {
    setStep('identify')
    setOtp('')
    setOtpError('')
  }

  function handleVerifyOtp(e) {
    e.preventDefault()
    if (otp !== DEMO_OTP) {
      setOtpError("Incorrect OTP. Please try again.")
      return
    }
    completeLogin()
  }

  const identityStatus = (
    <div className="mt-2 h-6">
      {role === 'unregistered' ? (
        <p className="text-xs text-red-600">
          Not a registered user — contact{' '}
          <a href="mailto:support@letstransport.team" className="underline">support@letstransport.team</a>
        </p>
      ) : role ? (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${ROLE_BADGE_STYLE[role]}`}>
          <SharedIcon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} /> {role === 'partner' ? `${match?.org} · ${ACCOUNT_ROLE_LABEL[match?.accountRole]}` : `${ROLE_LABELS[role]} · ${match?.name}`}
        </span>
      ) : null}
    </div>
  )

  return (
    <div className="relative -mb-[22px] -mt-[54px] flex min-h-0 flex-1 flex-col bg-gradient-to-b from-white to-[#F3F5F9] pb-[22px] pt-[54px] text-brand-navy">
      {sso && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-slate-900/40">
          <div className="flex-1" />
          <div className="rounded-t-[28px] bg-white px-6 pb-8 pt-3 shadow-[0_-12px_40px_rgba(15,27,61,0.25)]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

            {sso.step === 'redirecting' && (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">{sso.provider.icon}</span>
                <div className="mt-5 h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-orange" />
                <p className="mt-4 text-[16px] font-semibold">Redirecting to {sso.provider.name}</p>
                <p className="mt-1 text-[13px] text-slate-500">Secure sign-in in progress…</p>
              </div>
            )}

            {sso.step === 'accounts' && (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">{sso.provider.icon}</span>
                  <div>
                    <h2 className="text-[18px] font-bold leading-tight">Choose an account</h2>
                    <p className="text-[12px] text-slate-500">to continue to FLOW</p>
                  </div>
                </div>
                <div className="mt-4 max-h-[300px] divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-200">
                  {PARTNER_USERS.map((u) => (
                    <button key={u.email} type="button" onClick={() => pickAccount(u)} className="flex w-full items-center gap-3 bg-white p-3.5 text-left active:bg-slate-50">
                      <Avatar name={u.name} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">{u.name}</span>
                        <span className="block truncate text-[12px] text-slate-500">{u.email}</span>
                      </span>
                      <Chip tone={u.accountRole === 'primary' ? 'violet' : 'neutral'}>{u.accountRole === 'primary' ? 'Primary' : 'Driver'}</Chip>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-center text-[11px] text-slate-400">FLOW will receive your name and email address only.</p>
                <button type="button" onClick={() => setSso(null)} className="mt-2 w-full py-2 text-[14px] font-semibold text-slate-500">Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
      {signingIn && <TruckLoader duration={1500} label="Signing you in" />}

      <div className="flex flex-1 flex-col px-6 pt-5">
        <div className="flex flex-col items-center">
          <img src={flowLogo} alt="FLOW by LetsTransport" className="h-auto w-[200px]" />
        </div>

        {step === 'otp' ? (
          <form onSubmit={handleVerifyOtp} className="mt-8">
            <h2 className="text-center text-[26px] font-bold tracking-tight">Enter OTP</h2>
            <p className="mt-1.5 text-center text-[14px] text-slate-500">
              Sent to <span className="font-medium text-brand-navy">{identifier.trim()}</span>
            </p>
            <div className="mt-8">
              <label className={LABEL}>6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                placeholder="••••••"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  setOtpError('')
                }}
                className={`${INPUT} !pl-4 text-center text-2xl font-semibold tracking-[0.5em]`}
              />
              {otpError && <p className="mt-2 text-xs text-red-600">{otpError}</p>}
            </div>
            <button type="submit" disabled={otp.length !== 6} className={`${CTA} mt-6`}>
              Verify &amp; Sign in
            </button>
            <div className="mt-5 flex items-center justify-between text-[13px]">
              <button type="button" onClick={handleChangeIdentifier} className="font-medium text-slate-500"><span className="inline-flex items-center gap-1"><SharedIcon name="chevronLeft" className="h-4 w-4" />Change number</span></button>
              <button type="button" onClick={() => setOtp('')} className="font-semibold text-brand-orange">Resend OTP</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSendOtp} className="mt-8">
            <p className="text-center text-[14px] text-slate-500">Sign in to continue to your FLOW account.</p>

            <div className="mt-8">
              <label className={LABEL}>Email or mobile</label>
              <div className="relative">
                <Icon><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></Icon>
                <input
                  type="text"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  placeholder="Email or 10-digit mobile"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value)
                  }}
                  className={INPUT}
                />
              </div>
              {identityStatus}
            </div>

            <button type="submit" disabled={!isRegistered} className={`${CTA} mt-3`}>
              Send OTP
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>

            <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={() => pickProvider(GOOGLE)}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white py-3.5 text-[15px] font-semibold text-brand-navy shadow-[0_1px_2px_rgba(15,23,42,0.04)] active:scale-[0.98]"
            >
              {GOOGLE.icon}
              Continue with Google
            </button>
          </form>
        )}
      </div>

      <div className="mt-4 border-t border-slate-200 bg-white/70 px-6 py-4 text-center">
        <p className="flex items-center justify-center gap-2 text-[12px] font-semibold text-slate-600">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
          FLOW App by LetsTransport
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Freight &amp; Logistics Operating World</p>
      </div>
    </div>
  )
}
