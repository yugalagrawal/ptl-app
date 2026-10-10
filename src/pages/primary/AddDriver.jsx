import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPartner } from '../../data/session'
import { addDriver } from '../../data/directory'
import TopBar from '../../components/TopBar'
import PrimaryNav from '../../components/PrimaryNav'
import Icon from '../../components/Icon'
import { ActionBar, Button, Card, TextField } from '../../components/ui'

const EMPTY = { name: '', mobile: '', email: '', vehicle: '' }

export default function AddDriver() {
  const navigate = useNavigate()
  const me = getPartner()
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [added, setAdded] = useState(null)
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined, form: undefined }) }

  function submit() {
    const e = {}
    if (f.name.trim().length < 2) e.name = 'Enter the driver\'s full name'
    if (f.mobile.replace(/\D/g, '').slice(-10).length !== 10) e.mobile = 'Enter a 10-digit mobile number'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address'
    if (f.vehicle.trim().length < 5) e.vehicle = 'Enter the vehicle registration number'
    if (Object.keys(e).length) return setErrors(e)
    const res = addDriver(me.partnerId, f)
    if (res.error) return setErrors({ form: res.error })
    setAdded(res.account)
  }

  if (added) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <TopBar title="Add driver" back />
        <div className="flex-1 px-4 pt-6">
          <Card className="flex flex-col items-center px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Icon name="check" className="h-6 w-6" strokeWidth={2.2} /></span>
            <p className="mt-3 text-base font-semibold text-slate-900">{added.name} added</p>
            <p className="mt-1 max-w-[260px] text-[13px] text-slate-500">They can now sign in with {added.email} or {added.mobile}. LT will start assigning run sheets once they're on duty.</p>
          </Card>
        </div>
        <ActionBar>
          <Button block onClick={() => navigate('/drivers')}>Back to drivers</Button>
          <Button block variant="secondary" onClick={() => { setF(EMPTY); setAdded(null) }}>Add another driver</Button>
        </ActionBar>
        <PrimaryNav />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Add driver" subtitle={me.org} back />
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-4">
        <Card className="space-y-4 p-4">
          <TextField label="Full name" placeholder="e.g. Rakesh Singh" value={f.name} onChange={set('name')} error={errors.name} />
          <TextField label="Mobile number" inputMode="numeric" placeholder="10-digit mobile" value={f.mobile} onChange={set('mobile')} error={errors.mobile} />
          <TextField label="Email" type="email" autoCapitalize="none" placeholder="driver@company.com" value={f.email} onChange={set('email')} error={errors.email} />
          <TextField label="Vehicle number" autoCapitalize="characters" placeholder="e.g. HR 55 AB 1234" value={f.vehicle} onChange={set('vehicle')} error={errors.vehicle} />
        </Card>
        {errors.form && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{errors.form}</p>}
        <p className="text-xs text-slate-500">The driver gets their own sign-in. Run sheets are assigned to them automatically by LT while they are on duty.</p>
      </div>
      <ActionBar>
        <Button block onClick={submit}>Add driver</Button>
      </ActionBar>
      <PrimaryNav />
    </div>
  )
}
