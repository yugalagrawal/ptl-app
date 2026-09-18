import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addPackageToPickup, CONTENT_TYPES } from '../data/pickups'
import TopBar from '../components/TopBar'
import ScanIcon from '../components/ScanIcon'

function randomBarcode() {
  return `AWB${Math.floor(100000000 + Math.random() * 900000000)}`
}

export default function ScanPackage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [barcode, setBarcode] = useState('')
  const [contentType, setContentType] = useState(CONTENT_TYPES[0])
  const [weight, setWeight] = useState('')
  const [scanned, setScanned] = useState(false)

  function simulateScan() {
    setBarcode(randomBarcode())
    setScanned(true)
  }

  function handleAdd(addAnother) {
    if (!barcode || !weight) return
    addPackageToPickup(id, { barcode, contentType, weight })
    if (addAnother) {
      setBarcode('')
      setWeight('')
      setScanned(false)
    } else {
      navigate(`/pickup/${id}`)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Scan Package" back />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!scanned ? (
          <button
            onClick={simulateScan}
            className="w-full aspect-square max-h-64 rounded-2xl border-2 border-dashed border-brand-navy/30 bg-brand-navy/5 flex flex-col items-center justify-center gap-2 text-brand-navy"
          >
            <ScanIcon className="w-10 h-10" />
            <span className="text-sm font-medium">Tap to scan barcode / QR</span>
          </button>
        ) : (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600 font-medium">Scanned</p>
              <p className="text-sm font-semibold text-emerald-900">{barcode}</p>
            </div>
            <button onClick={simulateScan} className="text-xs text-emerald-700 font-medium">Rescan</button>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-700">Barcode / AWB no.</label>
          <input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter manually if scan fails"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Content type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          >
            {CONTENT_TYPES.map((ct) => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          />
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white space-y-2">
        <button
          onClick={() => handleAdd(true)}
          disabled={!barcode || !weight}
          className="w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl disabled:opacity-40 active:scale-[0.98] transition-transform"
        >
          Add & Scan Next
        </button>
        <button
          onClick={() => handleAdd(false)}
          disabled={!barcode || !weight}
          className="w-full bg-brand-orange text-white font-semibold py-3 rounded-xl disabled:opacity-40 active:scale-[0.98] transition-transform"
        >
          Add & Done
        </button>
      </div>
    </div>
  )
}
