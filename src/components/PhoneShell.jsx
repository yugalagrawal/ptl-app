// Centers app content in a fixed phone-width column so the prototype browses
// in the same shape as a mobile device, on any desktop browser.
export default function PhoneShell({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-200 py-6">
      <div className="w-full max-w-[420px] h-[min(844px,92vh)] bg-[#F6F7F9] shadow-2xl rounded-[2rem] overflow-hidden flex flex-col relative border border-slate-300">
        {children}
      </div>
    </div>
  )
}
