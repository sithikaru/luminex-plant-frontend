'use client'
import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function ManagerDashboard() {
  const { data } = useQuery({
    queryKey: ['inventory.snapshot'],
    queryFn: async () => (await api.get('/batches?status=IN_PROGRESS&limit=5')).data
  })

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="font-semibold">Recent In-Progress Batches</div>
        <ul className="mt-2 text-sm">
          {(data?.data ?? []).map((b: any) => (
            <li key={b.id} className="border-b py-2 last:border-none">
              {b.batchNumber} – {b.species?.name} – Qty {b.currentQty}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
