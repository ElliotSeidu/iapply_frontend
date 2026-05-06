import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', applications: 2 },
  { day: 'Tue', applications: 5 },
  { day: 'Wed', applications: 8 },
  { day: 'Thu', applications: 3 },
  { day: 'Fri', applications: 1 },
  { day: 'Sat', applications: 6 },
  { day: 'Sun', applications: 4 },
]

export default function VelocityChart() {
  return (
    <div className="chart-card">
      <h3 className='text-xl font-semibold'>Application Velocity</h3>
      <p className='text-md font-light'>Your activity over the last 7 days</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="applications" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}