import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', applications: 2 },
  { day: 'Tue', applications: 5 },
  { day: 'Wed', applications: 8 },
  { day: 'Thu', applications: 3 },
  { day: 'Fri', applications: 1 },
  { day: 'Sat', applications: 6 },
  { day: 'Sun', applications: 4 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-3 py-2 text-xs">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-[#7c3aed] font-bold mt-0.5">{payload[0].value} applications</p>
      </div>
    );
  }
  return null;
};

export default function VelocityChart() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700">Application Velocity</h3>
      <p className="text-xs text-slate-400 mt-0.5 mb-4">Your activity over the last 7 days</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f0ff', radius: 6 }} />
          <Bar dataKey="applications" fill="#7c3aed" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}