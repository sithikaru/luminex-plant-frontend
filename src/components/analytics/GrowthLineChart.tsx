'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface MeasurementData {
  createdAt: string
  avgGirth: number
  avgHeight: number
}

interface Props {
  data: MeasurementData[]
}

export function GrowthLineChart({ data }: Props) {
  return (
    <div className="w-full h-72 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2">Growth Trend</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="createdAt"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) =>
              `Date: ${new Date(value).toLocaleDateString()}`
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgGirth"
            stroke="#8884d8"
            name="Avg Girth (cm)"
          />
          <Line
            type="monotone"
            dataKey="avgHeight"
            stroke="#82ca9d"
            name="Avg Height (cm)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
