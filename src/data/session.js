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
  session = {
    role,
    name: identity.name || identity.contact || 'PTL User',
    email: identity.email || null,
    phone: identity.mobile || (identifier.includes('@') ? null : identifier),
    roleLabel: identity.roleLabel || null,
    id: identity.email ? identity.email.split('@')[0].toUpperCase() : 'PTR-4471',
    hub: role === 'partner' ? 'Gurugram Udyog Vihar Hub' : null,
  }
  return session
}

export function logout() {
  session = null
}
