import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPickup, saveFieldDetails } from '../data/prs'
import TopBar from '../components/TopBar'
import { Button, ActionBar, Card, Chip } from '../components/ui'

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</span>
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
      />
    </label>
  )
}

// This is the "Create Docket" step of the Pickup → Docket lifecycle:
// everything here was optional back at Create Pickup (see the console's
// updatePickupFieldDetails) — consignee, actual/volumetric weight, final
// package count — and becomes mandatory on-site, since a docket can't be
// raised without it. Docket Status reads Pending the entire time this form
// is open; submitting raises the docket immediately (saveFieldDetails,
// data/prs.js) and moves on to Print Labels, not straight to scanning — no
// pack IDs exist yet at this point.
export default function FieldDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pickup = getPickup(id)

  const [company, setCompany] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [actualWeightKg, setActualWeightKg] = useState('')
  const [volumetricWeightKg, setVolumetricWeightKg] = useState('')
  const [packagesCount, setPackagesCount] = useState(String(pickup?.packagesEstimate ?? ''))

  if (!pickup) return null

  const isComplete =
    company.trim() && contactName.trim() && phone.trim() && address.trim() && pincode.trim() && city.trim() &&
    actualWeightKg !== '' && volumetricWeightKg !== '' && packagesCount !== '' && Number(packagesCount) > 0

  function handleSubmit() {
    if (!isComplete) return
    saveFieldDetails(id, {
      consignee: { company: company.trim(), name: contactName.trim(), phone: phone.trim(), address: address.trim(), pincode: pincode.trim(), city: city.trim() },
      actualWeightKg,
      volumetricWeightKg,
      packagesCount,
    })
    navigate(`/pickup/${id}/print-labels`)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Create Docket" back />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-slate-500">
            These weren't captured while booking this pickup. They're required to raise the docket.
          </p>
          <Chip tone="warn">Docket pending</Chip>
        </div>

        <div>
          <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-slate-500">Consignee (drop) details</h2>
          <Card className="p-4 space-y-3.5">
            <Field label="Consignee / Company name" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Business or brand name" />
            <Field label="Contact person" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Name at the drop point" />
            <Field label="Contact phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" />
            <Field label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Building, street, area" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pincode" inputMode="numeric" value={pincode} onChange={(e) => setPincode(e.target.value)} />
              <Field label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </Card>
        </div>

        <div>
          <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-slate-500">Package details</h2>
          <Card className="p-4 space-y-3.5">
            <Field
              label={`Actual weight (kg) · est. ${pickup.estWeightKg} kg`}
              type="number" inputMode="decimal" value={actualWeightKg} onChange={(e) => setActualWeightKg(e.target.value)} placeholder="0.0"
            />
            <Field label="Volumetric weight (kg)" type="number" inputMode="decimal" value={volumetricWeightKg} onChange={(e) => setVolumetricWeightKg(e.target.value)} placeholder="0.0" />
            <Field
              label={`Final package count · est. ${pickup.packagesEstimate}`}
              type="number" inputMode="numeric" value={packagesCount} onChange={(e) => setPackagesCount(e.target.value)}
            />
            <p className="text-xs text-slate-500 -mt-1">This is how many labels you'll need next.</p>
          </Card>
        </div>
      </div>

      <ActionBar>
        {!isComplete && <p className="text-center text-xs text-slate-500">Fill in all fields to continue</p>}
        <Button block onClick={handleSubmit} disabled={!isComplete}>Create docket</Button>
      </ActionBar>
    </div>
  )
}
