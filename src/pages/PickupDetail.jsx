import { useNavigate, useParams } from 'react-router-dom'
import { getPickup, removePackageFromPickup, completePickup } from '../data/pickups'
import TopBar from '../components/TopBar'
import StatusBadge from '../components/StatusBadge'

export default function PickupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pickup = getPickup(id)

  if (!pickup) {
    return (
      <div className="flex-1 flex flex-col">
        <TopBar title="Not found" back />
        <p className="p-4 text-sm text-slate-500">Pickup not found.</p>
      </div>
    )
  }

  function handleRemove(pkgId) {
    removePackageFromPickup(id, pkgId)
    navigate(0)
  }

  function handleComplete() {
    completePickup(id)
    navigate('/home')
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title={pickup.id} back />
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="bg-white p-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-slate-900">{pickup.client}</p>
            <StatusBadge status={pickup.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">{pickup.address}</p>
          <div className="flex items-center gap-2 mt-3">
            <a href={`tel:${pickup.phone}`} className="flex-1 text-center text-sm font-medium text-brand-navy bg-slate-100 rounded-lg py-2">
              📞 {pickup.contact}
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(pickup.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center text-sm font-medium text-brand-navy bg-slate-100 rounded-lg py-2"
            >
              🧭 Navigate
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-3">Slot {pickup.slot} · Expected {pickup.expectedPkgs} packages</p>
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-900">Scanned packages ({pickup.packages.length})</h2>
          </div>

          {pickup.packages.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
              No packages scanned yet
            </div>
          ) : (
            <div className="space-y-2">
              {pickup.packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{pkg.barcode}</p>
                    <p className="text-xs text-slate-400">{pkg.contentType} · {pkg.weight} kg</p>
                  </div>
                  {pickup.status !== 'docket_created' && pickup.status !== 'completed' && (
                    <button onClick={() => handleRemove(pkg.id)} className="text-xs text-red-500 font-medium">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {pickup.docket && (
          <div className="mx-4 mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-sm font-semibold text-blue-900">Tentative Docket {pickup.docket.docketNo}</p>
            <p className="text-xs text-blue-700 mt-1">
              {pickup.docket.totalPackages} packages · {pickup.docket.totalWeight} kg total
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white space-y-2">
        {pickup.status !== 'docket_created' && pickup.status !== 'completed' && (
          <button
            onClick={() => navigate(`/pickup/${id}/scan`)}
            className="w-full bg-brand-navy text-white font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform"
          >
            📷 Scan Package
          </button>
        )}
        {pickup.packages.length > 0 && pickup.status !== 'docket_created' && pickup.status !== 'completed' && (
          <button
            onClick={() => navigate(`/pickup/${id}/docket`)}
            className="w-full bg-brand-orange text-white font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform"
          >
            Review & Create Docket
          </button>
        )}
        {pickup.status === 'docket_created' && (
          <button
            onClick={handleComplete}
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform"
          >
            ✓ Mark Pickup Complete
          </button>
        )}
        {pickup.status === 'completed' && (
          <div className="text-center text-sm font-medium text-emerald-600 py-2">Pickup completed</div>
        )}
      </div>
    </div>
  )
}
