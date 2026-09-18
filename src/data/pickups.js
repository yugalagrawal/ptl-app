// Mock data only — no backend. Mutations live in module state and reset on reload.

export const CONTENT_TYPES = ['General Cargo', 'Pharma', 'Electronics', 'FMCG', 'Documents', 'Perishables']

let pickups = [
  {
    id: 'PU-10231',
    client: 'Lenskart Solutions Pvt Ltd',
    address: 'Plot 14, Sector 18, Udyog Vihar, Gurugram, Haryana 122015',
    contact: 'Ramesh Kumar',
    phone: '98110 22334',
    slot: '10:00 AM – 12:00 PM',
    expectedPkgs: 8,
    status: 'pending', // pending | in_progress | docket_created | completed
    packages: [],
    docket: null,
  },
  {
    id: 'PU-10232',
    client: 'Nykaa Fashion',
    address: 'Tower B, DLF Cyber City, Gurugram, Haryana 122002',
    contact: 'Priya Sharma',
    phone: '98730 44521',
    slot: '12:00 PM – 2:00 PM',
    expectedPkgs: 15,
    status: 'pending',
    packages: [],
    docket: null,
  },
  {
    id: 'PU-10233',
    client: 'BlueDart Warehouse',
    address: 'Sector 32, Udyog Vihar Phase IV, Gurugram, Haryana 122001',
    contact: 'Vikram Singh',
    phone: '99998 12345',
    slot: '2:00 PM – 4:00 PM',
    expectedPkgs: 3,
    status: 'pending',
    packages: [],
    docket: null,
  },
]

export function getPickups() {
  return pickups
}

export function getPickup(id) {
  return pickups.find((p) => p.id === id)
}

export function addPackageToPickup(id, pkg) {
  const pickup = getPickup(id)
  if (!pickup) return
  pickup.packages = [...pickup.packages, { ...pkg, id: `PKG-${Date.now()}` }]
  if (pickup.status === 'pending') pickup.status = 'in_progress'
}

export function removePackageFromPickup(id, pkgId) {
  const pickup = getPickup(id)
  if (!pickup) return
  pickup.packages = pickup.packages.filter((p) => p.id !== pkgId)
}

let docketSeq = 5001

export function createTentativeDocket(id) {
  const pickup = getPickup(id)
  if (!pickup) return null
  const docket = {
    docketNo: `DKT-T${docketSeq++}`,
    createdAt: new Date().toISOString(),
    totalPackages: pickup.packages.length,
    totalWeight: pickup.packages.reduce((sum, p) => sum + Number(p.weight || 0), 0),
    status: 'tentative',
  }
  pickup.docket = docket
  pickup.status = 'docket_created'
  return docket
}

export function completePickup(id) {
  const pickup = getPickup(id)
  if (!pickup) return
  pickup.status = 'completed'
}
