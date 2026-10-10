import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPickup, preparePacks, buildSystemPacks, buildStockPacks } from '../data/prs'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import { Button, ActionBar, Card } from '../components/ui'

const DEFAULT_STOCK_RANGE = '900000001'

function Choice({ icon, title, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full min-h-[64px] text-left rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3 transition active:bg-slate-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon name={icon} className="w-5 h-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="block text-xs text-slate-500 mt-0.5">{sub}</span>
      </span>
      <Icon name="chevronRight" className="w-4 h-4 text-slate-400" />
    </button>
  )
}

const INPUT = 'h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-[15px] text-slate-900 tabular-nums placeholder:text-slate-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20'
const LABEL = 'mb-1.5 block text-[13px] font-medium text-slate-700'

// Implements the "Pickup sticker flows" reference, simplified to the
// choices/states that matter for this prototype (real print/PDF generation
// and an actual offline sync queue are out of scope):
//   Case 1 (infoCompleteness 'full')    — docket/labels effectively ready
//     before pickup; partner picks pre-print-at-office vs print-at-site,
//     then reconciles scanned-vs-printed count (same/less/more).
//   Case 2 (infoCompleteness 'minimal') — only consignor was known; partner
//     picks printer vs stock stickers on-site.
//   Case 3 (fallback, reachable from either case) — printer/system failed;
//     hand-fill stock stickers now, "sync" once back online.
// Whatever path is taken, it ends by calling preparePacks() with a concrete
// pack list, then moves on to Scan.
export default function PrintLabels() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pickup = getPickup(id)
  const [step, setStep] = useState('choose') // choose | reconcile | stock-entry | fallback
  const [printPlace, setPrintPlace] = useState(null) // Case 1: 'office' | 'site'
  const [printedCount, setPrintedCount] = useState('')
  const [stockRangeStart, setStockRangeStart] = useState(DEFAULT_STOCK_RANGE)
  const [synced, setSynced] = useState(false)

  if (!pickup) return null

  const expected = pickup.packagesCount
  const isFullCase = pickup.infoCompleteness === 'full'

  function finish(packs) {
    preparePacks(id, packs)
    navigate(`/pickup/${id}/scan`)
  }

  function handlePrintedCountSubmit() {
    const printed = Number(printedCount) || 0
    if (printed === expected) {
      finish(buildSystemPacks(pickup.awbFamily, expected))
    } else if (printed < expected) {
      // Same-labelled ones stick+scan as printed; the shortfall gets extra
      // stock stickers so scanning can still reach the real pack count.
      const extra = expected - printed
      finish([
        ...buildSystemPacks(pickup.awbFamily, printed),
        ...buildStockPacks(stockRangeStart, extra),
      ])
    } else {
      // More printed than actually packed — void the unused ones in-app;
      // system total (packagesCount) is the truth, so only `expected` packs
      // are real.
      finish(buildSystemPacks(pickup.awbFamily, expected))
    }
  }

  function handlePrinterConfirm() {
    finish(buildSystemPacks(pickup.awbFamily, expected))
  }

  function handleStockConfirm() {
    finish(buildStockPacks(stockRangeStart, expected))
  }

  function handleFallbackSync() {
    setSynced(true)
  }

  function handleFallbackDone() {
    finish(buildStockPacks(stockRangeStart, expected, { linked: synced }))
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Print labels" back />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">{pickup.client}</p>
            <p className="text-xs text-slate-500 mt-0.5">Docket {pickup.docketNumber}</p>
          </div>
          <p className="text-sm font-semibold text-slate-900 tabular-nums">{expected} pkgs</p>
        </Card>

        {step === 'choose' && isFullCase && (
          <>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">Where were these printed?</p>
            <Choice icon="printer" title="Pre-printed at office" sub="Labels were printed before you left. Count packs against them." onClick={() => { setPrintPlace('office'); setPrintedCount(String(expected)); setStep('reconcile') }} />
            <Choice icon="pin" title="Print at site" sub="Count packs first, confirm, then print, stick and scan all." onClick={() => { setPrintPlace('site'); setPrintedCount(String(expected)); setStep('reconcile') }} />
          </>
        )}

        {step === 'choose' && !isFullCase && (
          <>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">How will you label these packages?</p>
            <Choice icon="printer" title="Printer" sub="Collect details in-app, print, stick and scan all." onClick={handlePrinterConfirm} />
            <Choice icon="tag" title="Stock stickers" sub="Use a pre-printed docket-book leaf instead." onClick={() => setStep('stock-entry')} />
          </>
        )}

        {step === 'reconcile' && (
          <Card className="p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Count vs printed</p>
              <p className="text-xs text-slate-500 mt-0.5">{printPlace === 'office' ? 'Go to site and count packs.' : 'Confirm the count in-app before printing.'}</p>
            </div>
            <label className="block">
              <span className={LABEL}>Packs printed / pre-labelled</span>
              <input type="number" inputMode="numeric" value={printedCount} onChange={(e) => setPrintedCount(e.target.value)} className={INPUT} />
            </label>
            <p className="text-xs text-slate-500">Actual pack count: <span className="font-medium text-slate-700">{expected}</span></p>
            {Number(printedCount) < expected && Number(printedCount) > 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                Fewer than expected. The shortfall ({expected - Number(printedCount)}) will use stock stickers.
              </p>
            )}
            {Number(printedCount) > expected && (
              <p className="text-xs text-sky-700 bg-sky-50 border border-sky-200 rounded-lg p-2.5">
                More than expected. The extra labels will be voided; system count ({expected}) stays the truth.
              </p>
            )}
          </Card>
        )}

        {step === 'stock-entry' && (
          <Card className="p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Docket-book leaf</p>
              <p className="text-xs text-slate-500 mt-0.5">Hand-fill the docket no., pincode, date and mode on the leaf, then enter the starting serial below.</p>
            </div>
            <label className="block">
              <span className={LABEL}>Starting stock serial (starts with 9)</span>
              <input inputMode="numeric" value={stockRangeStart} onChange={(e) => setStockRangeStart(e.target.value)} className={INPUT} />
            </label>
            <p className="text-xs text-slate-500">{expected} consecutive serials will be used, one per pack.</p>
          </Card>
        )}

        {step === 'fallback' && (
          <Card className="p-4 space-y-3 border-red-200">
            <div>
              <p className="text-sm font-semibold text-red-700">System or printer down</p>
              <p className="text-xs text-slate-500 mt-0.5">Hand-fill stock stickers now and write the serial range on the docket leaf. Link them in-app once you're back online. The first hub will reprint system stickers.</p>
            </div>
            <label className="block">
              <span className={LABEL}>Serial range written on the leaf</span>
              <input inputMode="numeric" value={stockRangeStart} onChange={(e) => setStockRangeStart(e.target.value)} className={INPUT} />
            </label>
            {synced && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">Linked. The first hub will reprint system stickers.</p>
            )}
          </Card>
        )}

        {step !== 'fallback' && (
          <Button variant="danger" size="md" block onClick={() => setStep('fallback')}>
            Printer or app failed at site
          </Button>
        )}
      </div>

      {step === 'reconcile' && (
        <ActionBar>
          <Button block onClick={handlePrintedCountSubmit}>Continue to scanning</Button>
        </ActionBar>
      )}
      {step === 'stock-entry' && (
        <ActionBar>
          <Button block onClick={handleStockConfirm}>Continue to scanning</Button>
        </ActionBar>
      )}
      {step === 'fallback' && (
        <ActionBar>
          <Button block onClick={handleFallbackDone}>Continue to scanning</Button>
          {!synced && <Button variant="secondary" block onClick={handleFallbackSync}>Sync now (back online)</Button>}
        </ActionBar>
      )}
    </div>
  )
}
