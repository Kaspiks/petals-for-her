import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#4F6D65', '#D4A5A5', '#7D9B8E', '#9CA3AF']

export default function ScentPopularityChart({ data, topLabel }) {
  if (!data?.length) {
    return (
      <div className="h-64 flex items-center justify-center text-stone-400 text-sm">
        No sales data for this period
      </div>
    )
  }

  const chartData = data.map((item, i) => ({
    name: item.name,
    value: item.percentage,
    revenue: item.revenue,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [`${value}%`, `${name} ($${props.payload.revenue?.toFixed(2)})`]}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span className="text-sm text-stone-600">
                {value}: {entry.payload.value}%
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {topLabel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xs text-stone-500 uppercase">TOP</p>
            <p className="text-lg font-semibold text-stone-800">{topLabel}</p>
          </div>
        </div>
      )}
    </div>
  )
}
