import { useNavigate } from 'react-router-dom'
import { getSession, logout } from '../data/session'
import { ROLE_LABELS } from '../data/directory'
import { Button, EmptyState } from '../components/ui'

export default function RoleNotAvailable() {
  const session = getSession()
  const navigate = useNavigate()

  function backToLogin() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 text-center">
      <EmptyState
        icon="info"
        title={`${ROLE_LABELS[session?.role] || 'This'} experience isn't built yet`}
        body={`You're signed in as ${session?.name} (${ROLE_LABELS[session?.role]}). The mobile prototype currently only covers the Ground Partner pickup flow.`}
      />
      <Button variant="secondary" onClick={backToLogin}>Back to sign in</Button>
    </div>
  )
}
