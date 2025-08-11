'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { toast } from 'sonner'

interface Batch {
  id: string
  batchNumber: string
  customName: string | null
  stage: string
}

export default function NewMeasurementPage() {
  const router = useRouter()
  const [batchId, setBatchId] = useState('')
  const [girth, setGirth] = useState('')
  const [height, setHeight] = useState('')
  const [sampleSize, setSampleSize] = useState('')
  const [notes, setNotes] = useState('')

  const { data: batches, isLoading } = useQuery<Batch[]>({
    queryKey: ['growing-batches'],
    queryFn: async () => {
      const res = await axios.get('/api/batches', {
        params: { stage: 'GROWING', limit: 100 }
      })
      return res.data.data
    }
  })

  const mutation = useMutation({
    mutationFn: async () => {
      await axios.post('/api/measurements', {
        batchId,
        girth: parseFloat(girth),
        height: parseFloat(height),
        sampleSize: parseInt(sampleSize),
        notes
      })
    },
    onSuccess: () => {
      toast.success('Measurement recorded')
      router.push('/batches')
    },
    onError: () => {
      toast.error('Failed to save measurement')
    }
  })

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Record Growth Measurement</h1>

      <div className="space-y-4">
        <div>
          <Label>Batch</Label>
          <Select value={batchId} onValueChange={setBatchId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a batch" />
            </SelectTrigger>
            <SelectContent>
              {batches?.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.customName ?? batch.batchNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Average Girth (cm)</Label>
          <Input
            type="number"
            step="0.01"
            value={girth}
            onChange={(e) => setGirth(e.target.value)}
          />
        </div>

        <div>
          <Label>Average Height (cm)</Label>
          <Input
            type="number"
            step="0.01"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div>
          <Label>Sample Size</Label>
          <Input
            type="number"
            value={sampleSize}
            onChange={(e) => setSampleSize(e.target.value)}
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          Submit
        </Button>
      </div>
    </div>
  )
}
