import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPartner } from '../../data/session'
import { getPartnerPrsList } from '../../data/prs'
import { getPartnerDrivers } from '../../data/directory'
import TopBar from '../../components/TopBar'
import PrimaryNav from '../../components/PrimaryNav'
import { Card, EmptyState, Tabs } from '../../components/ui'
import PrsCard from './PrsCard'

export default function PrsList() {
  const navigate = useNavigate()
  const me = getPartner()
  const [filter, setFilter] = useState('all')
  const list = getPartnerPrsList(me.partnerId)
  const drivers = getPartnerDrivers(me.partnerId)
  const match = {
    all: () => true,
    active: (r) => r.state === 'in_progress' || r.state === 'not_started',
    unassigned: (r) => r.state === 'unassigned',
    completed: (r) => r.state === 'completed',
  }
  const tabs = [['all', 'All'], ['active', 'Active'], ['unassigned', 'Unassigned'], ['completed', 'Done']].map(([key, label]) => ({ key, label, count: list.filter(match[key]).length }))
  const shown = list.filter(match[filter])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Run sheets" subtitle={`Assigned to ${me.org} by LT`} menu />
      <div className="bg-white px-2"><Tabs options={tabs} value={filter} onChange={setFilter} /></div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-6 pt-4">
        {shown.length === 0 ? (
          <Card><EmptyState icon="list" title="No run sheets here" /></Card>
        ) : (
          shown.map((r) => <PrsCard key={r.id} prs={r} driver={drivers.find((d) => d.driverId === r.driverId)} onClick={() => navigate(`/prs/${r.id}`)} />)
        )}
      </div>
      <PrimaryNav />
    </div>
  )
}
