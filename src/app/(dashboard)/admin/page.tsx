'use client'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card } from '@/components/ui/card'

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin.stats'],
    queryFn: async () => {
      const [batches, species, zones] = await Promise.all([
        api.get('/batches?limit=1'),
        api.get('/species?limit=1'),
        api.get('/zones?limit=1'),
      ])
      return {
        totalBatches: batches.data.pagination?.total ?? 0,
        totalSpecies: species.data.pagination?.total ?? 0,
        totalZones: zones.data.pagination?.total ?? 0,
      }
    }
  })

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="p-4"><div className="text-sm text-gray-500">Batches</div><div className="text-2xl font-semibold">{stats?.totalBatches ?? 0}</div></Card>
      <Card className="p-4"><div className="text-sm text-gray-500">Species</div><div className="text-2xl font-semibold">{stats?.totalSpecies ?? 0}</div></Card>
      <Card className="p-4"><div className="text-sm text-gray-500">Zones</div><div className="text-2xl font-semibold">{stats?.totalZones ?? 0}</div></Card>
    </div>
  )
}
