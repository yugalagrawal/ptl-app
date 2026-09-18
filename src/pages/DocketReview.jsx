import { useNavigate, useParams } from 'react-router-dom'
import { getPickup, createTentativeDocket } from '../data/pickups'
import TopBar from '../components/TopBar'

export default function DocketReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pickup = getPickup(id)

  if (!pickup) return null

  const totalWeight = pickup.packages.reduce((sum, p) => sum + Number(p.weight || 0), 0)

  function handleCreate() {
    createTentativeDocket(id)
    navigate(`/pickup/${id}`)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Review & Create Docket" back />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-sm font-semibold text-slate-900">{pickup.client}</p>
          <p className="text-xs text-slate-400 mt-0.5">{pickup.id}</p>
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400">Total packages</p>
              <p className="text-lg font-semibold text-slate-900 tabular-nums">{pickup.packages.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total weight</p>
              <p className="text-lg font-semibold text-slate-900 tabular-nums">{totalWeight.toFixed(1)} kg</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900 mb-2">Packages</h2>
          <div className="space-y-2">
            {pickup.packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-900">{pkg.barcode}</p>
                <p className="text-xs text-slate-500">{pkg.contentType} · {pkg.weight} kg</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800">
          This creates a <strong>tentative docket</strong> at the pickup point. Final docket & weight get confirmed at the hub.
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <button
          onClick={handleCreate}
          className="w-full bg-brand-orange text-white font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform"
        >
          Create Tentative Docket
        </button>
      </div>
    </div>
  )
}
