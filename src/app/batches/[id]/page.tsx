'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { GrowthLineChart } from '@/components/analytics/GrowthLineChart'
import axios from 'axios'

interface GrowthData {
  createdAt: string
  avgGirth: number
  avgHeight: number
}

export default function BatchDetailPage() {
  const { id } = useParams()

  const { data, isLoading, error } = useQuery<GrowthData[]>({
    queryKey: ['batch-growth', id],
    queryFn: async () => {
      const res = await axios.get(`/api/batches/${id}/growth`)
      return res.data
    }
  })

  return (
    <div className="max-w-4xl mx-auto py-4">
      <h1 className="text-xl font-bold mb-4">Batch Growth Details</h1>

      {isLoading && <p>Loading growth chart...</p>}
      {error && <p>Error loading chart.</p>}

      {data && data.length > 0 ? (
        <GrowthLineChart data={data} />
      ) : (
        !isLoading && <p>No growth data yet.</p>
      )}
    </div>
  )
}
