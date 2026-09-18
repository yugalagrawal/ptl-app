import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAs } from '../data/session'
import { detectIdentity, ROLE_LABELS } from '../data/directory'
import ltLogo from '../assets/lt-logo.svg'

const DEMO_OTP = '123456'
const DEMO_PASSWORD = 'demo-password'

const ROLE_BADGE_STYLE = {
  lt: 'bg-brand-navy/10 text-brand-navy',
  partner: 'bg-brand-orange/10 text-brand-orange-dark',
  client: 'bg-emerald-100 text-emerald-700',
}

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [method, setMethod] = useState('password') // 'password' | 'otp'
  const [step, setStep] = useState('identify') // 'identify' | 'otp' (only used when method === 'otp')
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [passwordError, setPasswordError] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const navigate = useNavigate()

  const { role, match } = useMemo(() => detectIdentity(identifier), [identifier])
  const isRegistered = role && role !== 'unregistered'

  function handleMethodChange(next) {
    setMethod(next)
    setStep('identify')
    setPasswordError('')
    setOtpError('')
  }

  function completeLogin() {
    loginAs(role, match, identifier.trim())
    navigate(role === 'partner' ? '/home' : '/not-available')
  }

  function handlePasswordSubmit(e) {
    e.preventDefault()
    if (!isRegistered) return
    if (password !== DEMO_PASSWORD) {
      setPasswordError(`Incorrect password — use the demo password "${DEMO_PASSWORD}"`)
      return
    }
    completeLogin()
  }

  function handleSendOtp(e) {
    e.preventDefault()
    if (!isRegistered) return
    setOtp('')
    setOtpError('')
    setStep('otp')
  }

  function handleChangeIdentifier() {
    setStep('identify')
    setOtp('')
    setOtpError('')
  }

  function handleVerifyOtp(e) {
    e.preventDefault()
    if (otp !== DEMO_OTP) {
      setOtpError(`Incorrect OTP — use the demo code ${DEMO_OTP}`)
      return
    }
    completeLogin()
  }

  const identityStatus = (
    <div className="mt-2 min-h-[26px]">
      {role === 'unregistered' ? (
        <div className="rounded-xl bg-red-50 border border-red-100 p-3">
          <p className="text-xs font-semibold text-red-700">Not Registered User</p>
          <p className="text-xs text-red-600 mt-0.5">
            Contact LT Support to get registered —{' '}
            <a href="mailto:support@letstransport.team" className="underline font-medium">
              support@letstransport.team
            </a>
          </p>
        </div>
      ) : role ? (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_BADGE_STYLE[role]}`}>
          ✓ Detected {ROLE_LABELS[role]} · {match?.name}
        </span>
      ) : (
        identifier.trim().length > 0 && (
          <span className="text-xs text-slate-400">Keep typing — we'll detect your account type</span>
        )
      )}
    </div>
  )

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="relative bg-brand-navy text-white px-6 pt-14 pb-9 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 15%, white 0, transparent 45%), radial-gradient(circle at 85% 75%, white 0, transparent 40%)',
          }}
        />
        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2.5 shadow-soft">
            <img src={ltLogo} alt="LetsTransport" className="h-full w-full" />
          </div>
          <div className="mt-3.5 text-[26px] font-bold tracking-tight">Lets Transport</div>
          <p className="mt-1 text-sm font-medium text-slate-400 tracking-wide">
            Logistics but <span className="text-brand-orange-light">better.</span>
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#F6F7F9] px-6 pt-6 pb-8">
        {step === 'otp' ? (
          <>
            <h2 className="text-[19px] font-semibold tracking-tight text-slate-900">Enter OTP</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sent to <span className="font-medium text-slate-700">{identifier.trim()}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">6-digit OTP</label>
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
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-3 text-lg tracking-[0.4em] text-center font-semibold text-slate-800 focus:outline focus:outline-2 focus:outline-brand-orange/40 focus:border-brand-orange"
                />
                {otpError ? (
                  <p className="mt-1.5 text-xs text-red-600">{otpError}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">Prototype — demo OTP is {DEMO_OTP}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full bg-brand-orange text-white font-semibold py-3 rounded-xl disabled:opacity-40 active:scale-[0.98] transition-transform"
              >
                Verify & Sign in
              </button>

              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={handleChangeIdentifier} className="text-slate-500 font-medium">
                  ← Change email/number
                </button>
                <button type="button" onClick={() => setOtp('')} className="text-brand-orange font-medium">
                  Resend OTP
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-[19px] font-semibold tracking-tight text-slate-900">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">Enter your work email or mobile number.</p>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Email or mobile number</label>
              <input
                type="text"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="you@letstransport.team or 98765 43210"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value)
                  setPasswordError('')
                }}
                className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-3 text-sm text-slate-800 focus:outline focus:outline-2 focus:outline-brand-orange/40 focus:border-brand-orange"
              />
              {identityStatus}
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => handleMethodChange('password')}
                className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                  method === 'password' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange('otp')}
                className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                  method === 'otp' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500'
                }`}
              >
                OTP
              </button>
            </div>

            {method === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setPasswordError('')
                    }}
                    className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-3 text-sm text-slate-800 focus:outline focus:outline-2 focus:outline-brand-orange/40 focus:border-brand-orange"
                  />
                  {passwordError ? (
                    <p className="mt-1.5 text-xs text-red-600">{passwordError}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">Prototype — demo password is "{DEMO_PASSWORD}"</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!isRegistered}
                  className="w-full bg-brand-orange text-white font-semibold py-3 rounded-xl disabled:opacity-40 active:scale-[0.98] transition-transform"
                >
                  Sign in
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendOtp} className="mt-4">
                <button
                  type="submit"
                  disabled={!isRegistered}
                  className="w-full bg-brand-orange text-white font-semibold py-3 rounded-xl disabled:opacity-40 active:scale-[0.98] transition-transform"
                >
                  Send OTP
                </button>
              </form>
            )}
          </>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">Prototype build · no real authentication yet</p>
      </div>
    </div>
  )
}
