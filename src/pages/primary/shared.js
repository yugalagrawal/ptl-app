import { getDriverPrs, getPartnerExceptions, getPartnerPrsList, isOnDuty } from '../../data/prs'
import { getPartnerDrivers } from '../../data/directory'

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

// Drivers of a partner with the run sheet (if any) each one is carrying.
export function getDriversWithRuns(partnerId) {
  return getPartnerDrivers(partnerId).map((d) => ({ ...d, prs: getDriverPrs(d.driverId), onDuty: isOnDuty(d.driverId) }))
}

export function getPartnerOverview(partnerId) {
  const prsList = getPartnerPrsList(partnerId)
  const drivers = getDriversWithRuns(partnerId)
  const onRun = drivers.filter((d) => d.prs && d.prs.state === 'in_progress').length
  const totalPickups = prsList.reduce((s, r) => s + r.total, 0)
  const donePickups = prsList.reduce((s, r) => s + r.done, 0)
  return {
    prsList,
    drivers,
    unassigned: prsList.filter((r) => r.state === 'unassigned'),
    exceptions: prsList.reduce((s, r) => s + r.exceptions, 0),
    exceptionList: getPartnerExceptions(partnerId),
    available: drivers.filter((d) => d.onDuty && !d.prs).length,
    onRun,
    totalPickups,
    donePickups,
    pct: totalPickups ? Math.round((donePickups / totalPickups) * 100) : 0,
  }
}
