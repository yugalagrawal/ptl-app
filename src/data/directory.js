// Demo identity directory + auto role-detection — mirrors the desktop
// PTL-Console's LT_USERS/CLIENT_USERS/PARTNER_USERS (src/data/users.js) so
// the same accounts resolve to the same persona on mobile. No real auth.

export const LT_DOMAIN = 'letstransport.team'

export const LT_USERS = [
  { email: 'priya.sharma@letstransport.team', mobile: '9876543211', name: 'Priya Sharma', roleLabel: 'Super Admin' },
  { email: 'rahul.mehta@letstransport.team', mobile: '9811100002', name: 'Rahul Mehta', roleLabel: 'Finance Manager' },
  { email: 'admin@letstransport.team', mobile: '9811100003', name: 'Admin', roleLabel: 'Super Admin' },
  { email: 'karan.verma@letstransport.team', mobile: '9811100004', name: 'Karan Verma', roleLabel: 'Collections Executive' },
]

export const CLIENT_USERS = [
  { email: 'ops@oriflame.com', mobile: '9876543212', name: 'Oriflame', contact: 'Anita Rao' },
  { email: 'logistics@nykaa.com', mobile: '9822200002', name: 'Nykaa', contact: 'Karan Sethi' },
  { email: 'scm@lenskart.com', mobile: '9822200003', name: 'Lenskart', contact: 'Divya Nair' },
]

// A partner organisation owns several linked accounts: one Primary Account
// (oversight — sees every run sheet and driver) and any number of Driver
// accounts (functional — works their own assigned run sheet in the field).
export const ACCOUNT_ROLE_LABEL = { primary: 'Primary Account', driver: 'Driver' }

export const PARTNERS = [
  {
    id: 'speedex',
    name: 'Speedex Logistics',
    accounts: [
      { email: 'ops@speedex.com', mobile: '9998812345', name: 'Suresh Yadav', accountRole: 'primary' },
      { email: 'ravi@speedex.com', mobile: '9876500001', name: 'Ravi Kumar', accountRole: 'driver', driverId: 'drv-ravi', vehicle: 'HR 55 AB 1234' },
      { email: 'mohan@speedex.com', mobile: '9876500002', name: 'Mohan Lal', accountRole: 'driver', driverId: 'drv-mohan', vehicle: 'HR 26 CD 5678' },
      { email: 'imran@speedex.com', mobile: '9876500003', name: 'Imran Khan', accountRole: 'driver', driverId: 'drv-imran', vehicle: 'DL 1L AF 9021' },
      { email: 'sunil@speedex.com', mobile: '9876500004', name: 'Sunil Verma', accountRole: 'driver', driverId: 'drv-sunil', vehicle: 'HR 38 EF 4410' },
    ],
  },
  {
    id: 'bhiwandi',
    name: 'Bhiwandi Cargo Movers',
    accounts: [
      { email: 'contact@bhiwandicargo.in', mobile: '9811122334', name: 'Suresh Patil', accountRole: 'primary' },
      { email: 'driver@bhiwandicargo.in', mobile: '9811122335', name: 'Dinesh Patil', accountRole: 'driver', driverId: 'drv-dinesh', vehicle: 'MH 04 GT 7710' },
    ],
  },
  {
    id: 'nair',
    name: 'Nair Freight Franchise',
    accounts: [
      { email: 'admin@nairfreight.com', mobile: '9873044521', name: 'Anitha Nair', accountRole: 'primary' },
      { email: 'driver@nairfreight.com', mobile: '9873044522', name: 'Joseph Mathew', accountRole: 'driver', driverId: 'drv-joseph', vehicle: 'KL 07 BQ 3302' },
    ],
  },
]

export const PARTNER_USERS = PARTNERS.flatMap((org) =>
  org.accounts.map((a) => ({ ...a, partnerId: org.id, org: org.name })),
)

// ---- Managed by a Primary Account ----
export function addDriver(partnerId, { name, mobile, email, vehicle }) {
  const org = getPartnerOrg(partnerId)
  const mob = mobile.replace(/\D/g, '').slice(-10)
  const mail = email.trim().toLowerCase()
  if (PARTNER_USERS.some((u) => u.email.toLowerCase() === mail)) return { error: 'This email is already registered.' }
  if (PARTNER_USERS.some((u) => u.mobile === mob)) return { error: 'This mobile number is already registered.' }
  const account = {
    email: mail, mobile: mob, name: name.trim(), accountRole: 'driver',
    driverId: `drv-${mob}`, vehicle: vehicle.trim().toUpperCase(), partnerId, org: org.name,
  }
  PARTNER_USERS.push(account)
  return { account }
}

const teams = [
  { id: 'team-1', partnerId: 'speedex', name: 'Gurugram', driverIds: ['drv-ravi', 'drv-sunil'] },
  { id: 'team-2', partnerId: 'speedex', name: 'Manesar', driverIds: ['drv-mohan', 'drv-imran'] },
]
let teamSeq = 3

export function getTeams(partnerId) {
  return teams.filter((t) => t.partnerId === partnerId)
}

export function saveTeam(partnerId, { id, name, driverIds }) {
  if (id) {
    const t = teams.find((x) => x.id === id)
    if (t) { t.name = name.trim(); t.driverIds = driverIds }
    return t
  }
  const t = { id: `team-${teamSeq++}`, partnerId, name: name.trim(), driverIds }
  teams.push(t)
  return t
}

export function deleteTeam(id) {
  const i = teams.findIndex((t) => t.id === id)
  if (i >= 0) teams.splice(i, 1)
}

export function getPartnerOrg(partnerId) {
  return PARTNERS.find((o) => o.id === partnerId)
}

export function getPartnerDrivers(partnerId) {
  return PARTNER_USERS.filter((u) => u.partnerId === partnerId && u.accountRole === 'driver')
}

function digitsOnly(value) {
  return value.replace(/\D/g, '').replace(/^91/, '').slice(-10)
}

function isEmail(value) {
  return value.includes('@')
}

function isPhone(value) {
  return digitsOnly(value).length === 10
}

// Returns { role: 'lt' | 'partner' | 'client' | 'unregistered' | null, match }
// — null role means not enough input yet to tell whether it's an email or
// phone. Only accounts found in the demo directory resolve to a persona;
// anything else (right shape, no match) comes back 'unregistered' so the
// login screen can point them to LT Support instead of guessing a role.
export function detectIdentity(raw) {
  const value = raw.trim()
  if (!value) return { role: null, match: null }

  if (isEmail(value)) {
    if (!value.includes('.') || value.endsWith('@')) return { role: null, match: null }
    const domain = value.split('@')[1]?.toLowerCase()
    if (domain === LT_DOMAIN) {
      const match = LT_USERS.find((u) => u.email.toLowerCase() === value.toLowerCase())
      return { role: 'lt', match: match || { email: value, name: 'LT Team Member', roleLabel: 'Team Member' } }
    }
    const partnerMatch = PARTNER_USERS.find((u) => u.email.toLowerCase() === value.toLowerCase())
    if (partnerMatch) return { role: 'partner', match: partnerMatch }
    const clientMatch = CLIENT_USERS.find((u) => u.email.toLowerCase() === value.toLowerCase())
    if (clientMatch) return { role: 'client', match: clientMatch }
    return { role: 'unregistered', match: null }
  }

  if (isPhone(value)) {
    const phone = digitsOnly(value)
    const ltMatch = LT_USERS.find((u) => u.mobile === phone)
    if (ltMatch) return { role: 'lt', match: ltMatch }
    const partnerMatch = PARTNER_USERS.find((u) => u.mobile === phone)
    if (partnerMatch) return { role: 'partner', match: partnerMatch }
    const clientMatch = CLIENT_USERS.find((u) => u.mobile === phone)
    if (clientMatch) return { role: 'client', match: clientMatch }
    return { role: 'unregistered', match: null }
  }

  return { role: null, match: null }
}

export const ROLE_LABELS = { lt: 'LT Team', partner: 'Partner', client: 'Client' }

