// Viewfinder-style scan icon (QR/barcode scan, like UPI scan-to-pay) —
// used everywhere the camera emoji previously stood in for "scan".
export default function ScanIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8" />
      <path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" />
      <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" />
      <path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <path d="M4 12h16" strokeDasharray="2.2 2.2" />
    </svg>
  )
}
