// AWB / Docket numbering — mirrors the desktop PTL-Console's own
// data/awb.js. One 7-digit "family" number per pickup (reserved the moment
// its on-site details are captured — saveFieldDetails, data/prs.js, since
// that's when packagesCount first becomes known), plus a 2-digit suffix and
// a Luhn (Modulus 10) check digit:
//   family (7) + suffix (2) + check digit (1) = 10 digits total
// suffix '00' is the **parent** Docket Number itself; '01'-'99' are each
// individually scanned **parcel** AWB, sharing the same family so a docket
// and its own parcels are visually/structurally linked. Pure numeric,
// DHL-style — DHL's own checksum is proprietary/undisclosed, so Luhn stands
// in for it: same class of "internal check digit" a scanner can validate
// without a lookup table.
export const DOCKET_SUFFIX = '00'

// Starts at a different base than the console's own generator (1000001+)
// purely so demo AWBs from the two prototypes never read as if they came
// from the same series.
let familySeq = 2000001
export function nextAwbFamily() {
  return String(familySeq++).padStart(7, '0')
}

export function luhnCheckDigit(digits) {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return (10 - (sum % 10)) % 10
}

export function buildAwb(family, suffix) {
  const base = `${family}${suffix}`
  return `${base}${luhnCheckDigit(base)}`
}

// Stock stickers — pre-printed leaves from a docket-book, used when a pack
// can't get a system-generated pack ID (no printer/app available at site,
// per the label-printing flowchart's Case 2/Case 3 paths). Per that
// flowchart's fixed rule "stock serials start with 9": force a 9-digit
// serial into the 9xxxxxxxx range, then apply the same Luhn check-digit
// scheme as system pack IDs, so a stock pack ID is the same length and
// shape as a system one — "scanners look up, never decode".
export function buildStockPackId(rangeStart, offset) {
  const n = 900000000 + ((Number(rangeStart) + offset) % 100000000)
  const serial = String(n).padStart(9, '0')
  return `${serial}${luhnCheckDigit(serial)}`
}
