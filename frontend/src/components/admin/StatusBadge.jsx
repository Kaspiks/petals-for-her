const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  paid: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-stone-100 text-stone-600 border-stone-200',
}

export default function StatusBadge({ status, statusCode }) {
  const colorClass = STATUS_COLORS[statusCode] || 'bg-stone-100 text-stone-600 border-stone-200'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  )
}
