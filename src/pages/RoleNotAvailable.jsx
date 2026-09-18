import { useNavigate } from 'react-router-dom'
import { getSession, logout } from '../data/session'
import { ROLE_LABELS } from '../data/directory'

export default function RoleNotAvailable() {
  const session = getSession()
  const navigate = useNavigate()

  function backToLogin() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-8 text-center">
      <p className="text-4xl mb-3">🚧</p>
      <p className="text-sm font-semibold text-slate-800">
        {ROLE_LABELS[session?.role] || 'This'} experience isn't built yet
      </p>
      <p className="text-xs text-slate-500 mt-1.5 max-w-[260px]">
        Detected you as <strong>{session?.name}</strong> ({ROLE_LABELS[session?.role]}). The mobile prototype
        currently only covers the Ground Partner pickup flow.
      </p>
      <button
        onClick={backToLogin}
        className="mt-6 text-sm font-medium text-brand-orange"
      >
        ← Back to sign in
      </button>
    </div>
  )
}
