export default function MetricCard({ title, value, change, changeLabel, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 relative overflow-hidden">
      {icon && (
        <div className="absolute right-4 top-4 opacity-20">
          {icon}
        </div>
      )}
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-semibold text-stone-800 mt-1">{value}</p>
      {(change != null || changeLabel) && (
        <p className="text-sm mt-2">
          {change != null && (
            <span className={change >= 0 ? 'text-[#D4A5A5]' : 'text-red-500'}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
          {changeLabel && <span className={change != null ? 'text-stone-500 ml-1' : ''}>{changeLabel}</span>}
        </p>
      )}
    </div>
  )
}
