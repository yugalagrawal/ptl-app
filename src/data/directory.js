// Demo identity directory + auto role-detection — mirrors the desktop
// PTL-Console's LT_USERS/CLIENT_USERS/PARTNER_USERS (src/data/users.js) so
// the same accounts resolve to the same persona on mobile. No real auth.

export const LT_DOMAIN = 'letstransport.team'

export const LT_USERS = [
  { email: 'priya.sharma@letstransport.team', mobile: '9811100001', name: 'Priya Sharma', roleLabel: 'Super Admin' },
  { email: 'rahul.mehta@letstransport.team', mobile: '9811100002', name: 'Rahul Mehta', roleLabel: 'Finance Manager' },
  { email: 'admin@letstransport.team', mobile: '9811100003', name: 'Admin', roleLabel: 'Super Admin' },
  { email: 'karan.verma@letstransport.team', mobile: '9811100004', name: 'Karan Verma', roleLabel: 'Collections Executive' },
]

export const CLIENT_USERS = [
  { email: 'ops@oriflame.com', name: 'Oriflame', contact: 'Anita Rao' },
  { email: 'logistics@nykaa.com', name: 'Nykaa', contact: 'Karan Sethi' },
  { email: 'scm@lenskart.com', name: 'Lenskart', contact: 'Divya Nair' },
]

export const PARTNER_USERS = [
  { email: 'ops@speedex.com', mobile: '9998812345', name: 'Speedex Logistics', contact: 'Suresh Yadav' },
  { email: 'contact@bhiwandicargo.in', mobile: '9811122334', name: 'Bhiwandi Cargo Movers', contact: 'Suresh Patil' },
  { email: 'admin@nairfreight.com', mobile: '9873044521', name: 'Nair Freight Franchise', contact: 'Anitha Nair' },
]

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
    return { role: 'unregistered', match: null }
  }

  return { role: null, match: null }
}

export const ROLE_LABELS = { lt: 'LT Team', partner: 'Partner', client: 'Client' }
