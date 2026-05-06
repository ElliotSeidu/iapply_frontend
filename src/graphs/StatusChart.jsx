import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Applied', value: 20 },
  { name: 'Interview', value: 8 },
  { name: 'Offer', value: 2 },
  { name: 'Rejected', value: 10 },
  { name: 'Withdrawn', value: 3 },
]

const COLORS = ['#7c3aed', '#22c55e', '#3b82f6', '#ef4444', '#6b7280']

export default function StatusChart() {
  return (
    <div className="chart-card">
      <h3 className='text-xl font-semibold'>Applications by Status</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}