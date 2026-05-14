import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Applied',   value: 20 },
  { name: 'Interview', value: 8  },
  { name: 'Offer',     value: 2  },
  { name: 'Rejected',  value: 10 },
  { name: 'Withdrawn', value: 3  },
];

const COLORS = ['#7c3aed', '#22c55e', '#3b82f6', '#ef4444', '#94a3b8'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-3 py-2 text-xs">
        <p className="font-semibold text-slate-700">{payload[0].name}</p>
        <p className="font-bold mt-0.5" style={{ color: payload[0].payload.fill }}>
          {payload[0].value} applications
        </p>
      </div>
    );
  }
  return null;
};

const renderLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
        {entry.value}
      </div>
    ))}
  </div>
);

export default function StatusChart() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700">Applications by Status</h3>
      <p className="text-xs text-slate-400 mt-0.5 mb-4">Current breakdown across all stages</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}