import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SalesTrendChart({ data }) {
  if (!data?.length) {
    return (
      <div className="h-64 flex items-center justify-center text-stone-400 text-sm">
        No sales data for this period
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F6D65" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4F6D65" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" stroke="#78716c" fontSize={12} />
        <YAxis stroke="#78716c" fontSize={12} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#4F6D65"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorValue)"
          dot={{ fill: '#D4A5A5', r: 4 }}
          activeDot={{ r: 6, fill: '#D4A5A5' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
