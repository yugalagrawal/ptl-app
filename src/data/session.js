// Mock auth — no backend. Resets on reload.
let session = null

export function getSession() {
  return session
}

// Kept for the Home/PickupDetail/Profile screens built for the Partner
// persona, which read `getPartner()` — only meaningful when role === 'partner'.
export function getPartner() {
  return session?.role === 'partner' ? session : null
}

export function loginAs(role, identity, identifier) {
  const isPartner = role === 'partner'
  session = {
    role,
    name: identity.name || identity.contact || 'PTL User',
    email: identity.email || null,
    phone: identity.mobile || (identifier.includes('@') ? null : identifier),
    roleLabel: identity.roleLabel || null,
    id: identity.email ? identity.email.split('@')[0].toUpperCase() : 'PTR-4471',
    partnerId: isPartner ? identity.partnerId : null,
    org: isPartner ? identity.org : null,
    accountRole: isPartner ? identity.accountRole : null,
    driverId: isPartner ? identity.driverId || null : null,
    vehicle: isPartner ? identity.vehicle || null : null,
    hub: isPartner ? (identity.accountRole === 'driver' ? `${identity.org} · ${identity.vehicle}` : identity.org) : null,
  }
  return session
}

export function isPrimary() {
  return session?.role === 'partner' && session.accountRole === 'primary'
}

export function isDriver() {
  return session?.role === 'partner' && session.accountRole === 'driver'
}

export function logout() {
  session = null
}
