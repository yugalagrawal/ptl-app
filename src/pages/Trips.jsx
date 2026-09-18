import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'

export default function Trips() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Trips" menu />
      <div className="flex-1 flex items-center justify-center px-8 text-center">
        <div>
          <p className="text-3xl mb-2">🚚</p>
          <p className="text-sm font-medium text-slate-600">Coming soon</p>
          <p className="text-xs text-slate-400 mt-1">Trip assignment & in-transit tracking for ground partners</p>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
