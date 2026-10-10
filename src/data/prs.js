// Mock data only — no backend. Mutations live in module state and reset on
// reload. Mirrors the desktop PTL-Console's PRS/pickup model (src/data/prs.js,
// src/data/pickups.js) just enough for this app's one use case: a single
// Partner, working through the one PRS (Pickup Run Sheet) currently assigned
// to them — only one PRS is ever assigned to a partner at a given time.
//
// A pickup's lifecycle here (terms match the desktop console's own
// PICKUP_STATUS_LABEL — "Picked Up"/"Reached Hub" — src/data/pickups.js):
//   PENDING          — not yet started
//   DETAILS_PENDING  — partner tapped "Start Pickup", on-site, needs to
//                      Create Docket: fill in consignee + actual/volumetric
//                      weight + final package count (everything optional
//                      back at booking time). Docket Status reads "Pending"
//                      the whole time this step is open.
//   LABEL_PENDING    — docket created (docketNumber assigned); partner still
//                      needs to resolve the Print Labels step (system print
//                      vs stock stickers vs the offline fallback — see the
//                      "Pickup sticker flows" reference) before any package
//                      can be scanned.
//   SCANNING         — labels resolved into a concrete `packs` list; partner
//                      is pasting a label on each package then scanning it,
//                      one by one, until every pack is scanned.
//   PICKED_UP        — every pack scanned. The docket already exists (it was
//                      raised back at Create Docket) — this step no longer
//                      creates anything, it just closes out the pickup.
//   REACHED_MINI_HUB — set once the partner has dropped off & scanned this
//                      pickup's packs at the assigned drop Mini Hub, after
//                      every pickup on the PRS reaches PICKED_UP.
//
// `exception` is a separate overlay, not a lifecycle stage — a pickup can be
// flagged Failed/Delayed/Reattempt/Other at any point before completion
// without blocking the rest of the flow, same way a real ground issue
// wouldn't stop a partner from still trying the rest of their run.
import { getSession } from './session.js'
import { PARTNER_USERS } from './directory.js'
import { nextAwbFamily, buildAwb, buildStockPackId, DOCKET_SUFFIX } from './awb.js'

export const PICKUP_STATUS = {
  PENDING: 'pending',
  DETAILS_PENDING: 'details_pending',
  LABEL_PENDING: 'label_pending',
  SCANNING: 'scanning',
  PICKED_UP: 'picked_up',
  REACHED_MINI_HUB: 'reached_mini_hub',
}

export const PICKUP_STATUS_LABEL = {
  [PICKUP_STATUS.PENDING]: 'Pending',
  [PICKUP_STATUS.DETAILS_PENDING]: 'Docket Pending',
  [PICKUP_STATUS.LABEL_PENDING]: 'Labels Pending',
  [PICKUP_STATUS.SCANNING]: 'Scanning',
  [PICKUP_STATUS.PICKED_UP]: 'Picked Up',
  [PICKUP_STATUS.REACHED_MINI_HUB]: 'Reached Mini Hub',
}

export const PICKUP_STATUS_BADGE = {
  [PICKUP_STATUS.PENDING]: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
  [PICKUP_STATUS.DETAILS_PENDING]: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  [PICKUP_STATUS.LABEL_PENDING]: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  [PICKUP_STATUS.SCANNING]: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',
  [PICKUP_STATUS.PICKED_UP]: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  [PICKUP_STATUS.REACHED_MINI_HUB]: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200',
}

export const EXCEPTION_TYPE = {
  FAILED: 'failed',
  DELAYED: 'delayed',
  REATTEMPT: 'reattempt',
  OTHER: 'other',
}

export const EXCEPTION_LABEL = {
  [EXCEPTION_TYPE.FAILED]: 'Failed',
  [EXCEPTION_TYPE.DELAYED]: 'Delayed',
  [EXCEPTION_TYPE.REATTEMPT]: 'Reattempt',
  [EXCEPTION_TYPE.OTHER]: 'Other',
}

export const EXCEPTION_BADGE = {
  [EXCEPTION_TYPE.FAILED]: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  [EXCEPTION_TYPE.DELAYED]: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  [EXCEPTION_TYPE.REATTEMPT]: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
  [EXCEPTION_TYPE.OTHER]: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
}

// mapX/mapY are percentage positions on the Route tab's schematic map
// (0–100), hand-placed to read as a plausible route, not real geocoding.
//
// infoCompleteness drives which case of the label-printing flowchart a
// pickup's Print Labels step follows: 'full' = everything was known before
// pickup (Case 1 — docket/labels effectively pre-generated), 'minimal' =
// only the consignor/FROM side was known at booking (Case 2 — partner
// decides printer vs stock stickers on-site). Mixed across the seed so both
// cases have a live example to demo.
let pickups = [
  {
    id: 'PU-10231',
    prsId: 'PRS-101',
    sequence: 1,
    client: 'Lenskart Solutions Pvt Ltd',
    consignor: { name: 'Ramesh Kumar', phone: '98110 22334' },
    address: 'Plot 14, Sector 18, Udyog Vihar, Gurugram, Haryana',
    pincode: '122015',
    city: 'Gurugram',
    slot: '10:00 AM – 12:00 PM',
    estWeightKg: 120,
    packagesEstimate: 8,
    mapX: 22, mapY: 14,
    infoCompleteness: 'full',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10232',
    prsId: 'PRS-101',
    sequence: 2,
    client: 'Nykaa Fashion',
    consignor: { name: 'Priya Sharma', phone: '98730 44521' },
    address: 'Tower B, DLF Cyber City, Gurugram, Haryana',
    pincode: '122002',
    city: 'Gurugram',
    slot: '11:00 AM – 1:00 PM',
    estWeightKg: 340,
    packagesEstimate: 15,
    mapX: 68, mapY: 28,
    infoCompleteness: 'minimal',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10233',
    prsId: 'PRS-101',
    sequence: 3,
    client: 'BlueDart Warehouse',
    consignor: { name: 'Vikram Singh', phone: '99998 12345' },
    address: 'Sector 32, Udyog Vihar Phase IV, Gurugram, Haryana',
    pincode: '122001',
    city: 'Gurugram',
    slot: '12:30 PM – 2:00 PM',
    estWeightKg: 60,
    packagesEstimate: 3,
    mapX: 46, mapY: 52,
    infoCompleteness: 'full',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10234',
    prsId: 'PRS-101',
    sequence: 4,
    client: 'Purplle Beauty Pvt Ltd',
    consignor: { name: 'Anjali Gupta', phone: '98110 55678' },
    address: 'Plot 9, IMT Manesar, Gurugram, Haryana',
    pincode: '122051',
    city: 'Gurugram',
    slot: '1:30 PM – 3:00 PM',
    estWeightKg: 210,
    packagesEstimate: 10,
    mapX: 74, mapY: 78,
    infoCompleteness: 'minimal',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10235',
    prsId: 'PRS-101',
    sequence: 5,
    client: 'Zepto Dark Store',
    consignor: { name: 'Suresh Yadav', phone: '98110 99887' },
    address: 'Sector 14, Gurugram, Haryana',
    pincode: '122001',
    city: 'Gurugram',
    slot: '3:00 PM – 4:30 PM',
    estWeightKg: 45,
    packagesEstimate: 4,
    mapX: 26, mapY: 108,
    infoCompleteness: 'full',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10236',
    prsId: 'PRS-102',
    sequence: 1,
    client: 'Myntra Designs Pvt Ltd',
    consignor: { name: 'Rohit Malhotra', phone: '98101 11223' },
    address: 'Plot 22, Sector 8, IMT Manesar, Gurugram, Haryana',
    pincode: '122051',
    city: 'Gurugram',
    slot: '9:30 AM – 11:00 AM',
    estWeightKg: 180,
    packagesEstimate: 9,
    mapX: 30, mapY: 18,
    infoCompleteness: 'full',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10237',
    prsId: 'PRS-102',
    sequence: 2,
    client: 'Meesho Fulfilment',
    consignor: { name: 'Neha Kapoor', phone: '98101 33445' },
    address: 'Unit 5, Binola Industrial Area, Gurugram, Haryana',
    pincode: '122413',
    city: 'Gurugram',
    slot: '11:30 AM – 1:00 PM',
    estWeightKg: 95,
    packagesEstimate: 5,
    mapX: 60, mapY: 50,
    infoCompleteness: 'minimal',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10238',
    prsId: 'PRS-102',
    sequence: 3,
    client: 'FirstCry Warehouse',
    consignor: { name: 'Deepak Rawat', phone: '98101 55667' },
    address: 'Plot 3, Sector 5, IMT Manesar, Gurugram, Haryana',
    pincode: '122050',
    city: 'Gurugram',
    slot: '2:00 PM – 3:30 PM',
    estWeightKg: 140,
    packagesEstimate: 7,
    mapX: 40, mapY: 85,
    infoCompleteness: 'full',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10239',
    prsId: 'PRS-103',
    sequence: 1,
    client: 'Pepperfry Hub',
    consignor: { name: 'Arun Bhatia', phone: '98102 77889' },
    address: 'Plot 41, Sector 37, Gurugram, Haryana',
    pincode: '122001',
    city: 'Gurugram',
    slot: '12:00 PM – 1:30 PM',
    estWeightKg: 70,
    packagesEstimate: 4,
    mapX: 35, mapY: 22,
    infoCompleteness: 'minimal',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
  {
    id: 'PU-10240',
    prsId: 'PRS-103',
    sequence: 2,
    client: 'Decathlon Store',
    consignor: { name: 'Kavita Rao', phone: '98102 99001' },
    address: 'Sector 29, Leisure Valley Road, Gurugram, Haryana',
    pincode: '122002',
    city: 'Gurugram',
    slot: '2:30 PM – 4:00 PM',
    estWeightKg: 110,
    packagesEstimate: 6,
    mapX: 65, mapY: 70,
    infoCompleteness: 'full',
    status: PICKUP_STATUS.PENDING,
    exception: null,
    consignee: null,
    actualWeightKg: null,
    volumetricWeightKg: null,
    packagesCount: null,
    awbFamily: null,
    docketNumber: null,
    scannedCount: 0,
    packs: [],
  },
]

// Run sheets belong to a partner organisation and are assigned to one of its
// Driver accounts (driverId null = not assigned yet — the Primary Account
// picks the driver). A driver works only the run sheet assigned to them.
// Run sheets are auto-assigned by the LT system (from the shipping console)
// to the partner and to a driver within it — nobody on the partner side
// creates assignments. The Primary Account can only manage them afterwards
// (switch/swap drivers, set drivers on/off duty). `log` is the audit trail.
const prsList = [
  { id: 'PRS-101', partnerId: 'speedex', hubName: 'Gurugram Udyog Vihar Hub', generatedAt: 'Today, 8:40 AM', driverId: 'drv-ravi', log: [{ text: 'Auto-assigned to Ravi Kumar', by: 'LT System', at: '8:40 AM' }] },
  { id: 'PRS-102', partnerId: 'speedex', hubName: 'Manesar IMT Hub', generatedAt: 'Today, 8:55 AM', driverId: 'drv-mohan', log: [{ text: 'Auto-assigned to Mohan Lal', by: 'LT System', at: '8:55 AM' }] },
  { id: 'PRS-103', partnerId: 'speedex', hubName: 'Gurugram Sector 37 Hub', generatedAt: 'Today, 9:10 AM', driverId: 'drv-imran', log: [{ text: 'Auto-assigned to Imran Khan', by: 'LT System', at: '9:10 AM' }] },
]

// Drivers a Primary Account has switched off duty (leave, vehicle in
// service…). The auto-assigner and the manual picker both skip them.
const offDuty = new Set()
export function isOnDuty(driverId) {
  return !offDuty.has(driverId)
}

// Session-local — drives the one-time "New Run Sheet Assigned" banner on
// Home. No backend/push exists in this prototype, so an in-app banner is as
// close as it gets to "the assigned Partner should be notified".
let prsNotificationSeen = false
export function isPrsNotificationSeen() {
  return prsNotificationSeen
}
export function markPrsNotificationSeen() {
  prsNotificationSeen = true
}

// The signed-in driver's own run sheet (undefined if none assigned).
export function getActivePrs() {
  const driverId = getSession()?.driverId
  return driverId ? prsList.find((r) => r.driverId === driverId) : undefined
}

export function getPickups() {
  const prs = getActivePrs()
  if (!prs) return []
  return pickups.filter((p) => p.prsId === prs.id).sort((a, b) => a.sequence - b.sequence)
}

// ---- Primary Account (oversight) helpers ----
export function isPickupDone(p) {
  return p.status === PICKUP_STATUS.PICKED_UP || p.status === PICKUP_STATUS.REACHED_MINI_HUB
}

export function getPrsPickups(prsId) {
  return pickups.filter((p) => p.prsId === prsId).sort((a, b) => a.sequence - b.sequence)
}

export const PRS_STATE = { UNASSIGNED: 'unassigned', NOT_STARTED: 'not_started', IN_PROGRESS: 'in_progress', COMPLETED: 'completed' }
export const PRS_STATE_LABEL = {
  unassigned: 'Unassigned',
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
}
export const PRS_STATE_BADGE = {
  unassigned: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  not_started: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
  in_progress: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
}

export function getPrsSummary(prs) {
  const list = getPrsPickups(prs.id)
  const done = list.filter(isPickupDone).length
  const started = list.some((p) => p.status !== PICKUP_STATUS.PENDING)
  let state = PRS_STATE.NOT_STARTED
  if (!prs.driverId) state = PRS_STATE.UNASSIGNED
  else if (list.length && done === list.length) state = PRS_STATE.COMPLETED
  else if (started) state = PRS_STATE.IN_PROGRESS
  return {
    ...prs,
    pickups: list,
    total: list.length,
    done,
    exceptions: list.filter((p) => p.exception).length,
    weightKg: list.reduce((sum, p) => sum + p.estWeightKg, 0),
    state,
    pct: list.length ? Math.round((done / list.length) * 100) : 0,
  }
}

function getPartnerDriverName(driverId) {
  return PARTNER_USERS.find((u) => u.driverId === driverId)?.name || 'driver'
}

export function getPartnerPrsList(partnerId) {
  return prsList.filter((r) => r.partnerId === partnerId).map(getPrsSummary)
}

export function getPrsById(prsId) {
  const prs = prsList.find((r) => r.id === prsId)
  return prs ? getPrsSummary(prs) : undefined
}

export function getDriverPrs(driverId) {
  const prs = prsList.find((r) => r.driverId === driverId)
  return prs ? getPrsSummary(prs) : undefined
}

// A driver can be switched any time before the run is completed. A driver
// already on another run sheet can only be swapped with if that run hasn't
// started; mid-run drivers are locked.
export function canReassign(prsId) {
  const s = getPrsById(prsId)
  return !!s && s.state !== PRS_STATE.COMPLETED
}

// Why a given driver can't take this run sheet right now (null = allowed).
export function driverBlockReason(prsId, driverId) {
  const own = prsList.find((r) => r.id === prsId)
  if (own?.driverId === driverId) return null
  if (!isOnDuty(driverId)) return 'Off duty'
  const other = prsList.find((r) => r.driverId === driverId && r.id !== prsId)
  if (other) {
    const st = getPrsSummary(other).state
    if (st === PRS_STATE.IN_PROGRESS) return `Mid-run on ${other.id}`
    if (st === PRS_STATE.COMPLETED) return `Finished ${other.id}`
  }
  return null
}

export function assignPrs(prsId, driverId, { reason, by } = {}) {
  const prs = prsList.find((r) => r.id === prsId)
  if (!prs || !canReassign(prsId) || !driverId) return null
  if (driverBlockReason(prsId, driverId)) return null
  const stamp = 'Just now'
  const other = prsList.find((r) => r.driverId === driverId && r.id !== prsId)
  const prevId = prs.driverId
  const nameOf = (id) => getPartnerDriverName(id)
  if (other) {
    other.driverId = prevId
    other.log.push({ text: `Switched to ${prevId ? nameOf(prevId) : 'no driver'} (swap with ${prsId})`, by: by || 'Primary Account', at: stamp, reason })
  }
  prs.driverId = driverId
  prs.log.push({ text: `${prevId ? `Switched from ${nameOf(prevId)} to` : 'Assigned to'} ${nameOf(driverId)}${other ? ` (swap with ${other.id})` : ''}`, by: by || 'Primary Account', at: stamp, reason })
  prsNotificationSeen = false
  return prs
}

export function setDutyStatus(driverId, onDuty) {
  if (onDuty) offDuty.delete(driverId)
  else offDuty.add(driverId)
}

// Every flagged pickup across a partner's run sheets, with its run sheet.
export function getPartnerExceptions(partnerId) {
  return prsList
    .filter((r) => r.partnerId === partnerId)
    .flatMap((r) => getPrsPickups(r.id).filter((p) => p.exception).map((p) => ({ pickup: p, prs: getPrsSummary(r) })))
}


export function getPickup(id) {
  return pickups.find((p) => p.id === id)
}

export function startPickup(id) {
  const p = getPickup(id)
  if (p && p.status === PICKUP_STATUS.PENDING) p.status = PICKUP_STATUS.DETAILS_PENDING
  return p
}

// Everything that was optional back at booking (Create Pickup) — consignee,
// actual/volumetric weight, final package count — becomes mandatory here,
// on-site, before a docket can be raised. This IS the "Create Docket" step:
// Docket Status reads Pending right up until this submits, at which point
// the docket number is generated immediately (the family/AWB series is
// reserved here too, since packagesCount first becomes known here) and the
// pickup moves on to Print Labels — not straight to scanning, since no pack
// IDs exist yet.
export function saveFieldDetails(id, { consignee, actualWeightKg, volumetricWeightKg, packagesCount }) {
  const p = getPickup(id)
  if (!p) return null
  p.consignee = consignee
  p.actualWeightKg = Number(actualWeightKg) || 0
  p.volumetricWeightKg = Number(volumetricWeightKg) || 0
  p.packagesCount = Number(packagesCount) || 0
  p.awbFamily = p.awbFamily ?? nextAwbFamily()
  p.docketNumber = buildAwb(p.awbFamily, DOCKET_SUFFIX)
  p.status = PICKUP_STATUS.LABEL_PENDING
  return p
}

// Called once Print Labels resolves which case applied (system print /
// stock stickers / offline fallback) into a concrete list of packs. `packs`
// is `[{ packId, source: 'system'|'stock', linked }]` — one entry per
// physical package, "1 pack = 1 ID forever" per the label-printing
// flowchart. packagesCount is re-derived from packs.length so a Case-1
// "printed MORE than needed" reconciliation (excess labels voided) is
// reflected as the real, smaller system count.
export function preparePacks(id, packs) {
  const p = getPickup(id)
  if (!p) return null
  p.packs = packs
  p.packagesCount = packs.length
  p.status = PICKUP_STATUS.SCANNING
  return p
}

// Builds a fresh all-system packs list for the common case (no stock
// stickers, nothing to reconcile) — used by Print Labels' simpler paths.
export function buildSystemPacks(awbFamily, count, { linked = true } = {}) {
  return Array.from({ length: count }, (_, i) => ({
    packId: buildAwb(awbFamily, String(i + 1).padStart(2, '0')),
    source: 'system',
    linked,
  }))
}

export function buildStockPacks(rangeStart, count, { linked = true } = {}) {
  return Array.from({ length: count }, (_, i) => ({
    packId: buildStockPackId(rangeStart, i),
    source: 'stock',
    linked,
  }))
}

// One tap = one sticker scanned — "paste the label, then scan" — pulling
// the next not-yet-scanned entry off the pack list Print Labels already
// built (no ID is invented here). The docket already exists (raised back at
// Create Docket), so the last scan just flips the pickup to Picked Up.
export function scanNextPackage(id) {
  const p = getPickup(id)
  if (!p) return p
  const next = p.packs.find((pack) => !pack.scanned)
  if (!next) return p
  next.scanned = true
  p.scannedCount += 1
  if (p.scannedCount === p.packagesCount) {
    p.status = PICKUP_STATUS.PICKED_UP
  }
  return p
}

// A pickup is ready to hand off at the Mini Hub only once every pack on it
// has actually been scanned (Picked Up or already dropped) — mirrors the
// "whole PRS ready to proceed" check the ask calls for, just per-pickup.
export function isReadyForMiniHub() {
  const mine = getPickups()
  return mine.length > 0 && mine.every(isPickupDone)
}

export function scanAtMiniHub(id) {
  const p = getPickup(id)
  if (p && p.status === PICKUP_STATUS.PICKED_UP) p.status = PICKUP_STATUS.REACHED_MINI_HUB
  return p
}

export function reportException(id, { type, note }) {
  const p = getPickup(id)
  if (!p) return null
  p.exception = { type, note, at: 'Just now' }
  return p
}

export function clearException(id) {
  const p = getPickup(id)
  if (p) p.exception = null
  return p
}
