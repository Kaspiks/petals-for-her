import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import MetricCard from '../../components/admin/MetricCard'
import SalesTrendChart from '../../components/admin/SalesTrendChart'
import ScentPopularityChart from '../../components/admin/ScentPopularityChart'
import TopProductsList from '../../components/admin/TopProductsList'
import StatusBadge from '../../components/admin/StatusBadge'

const DollarIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const BagIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

const FlowerIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

export default function DashboardPage() {
  const { fetchWithAuth } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetchWithAuth(`/api/v1/admin/dashboard?period=${period}`)
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [fetchWithAuth, period])

  const periodLabel = period === 'month'
    ? new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'This week'

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-64" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-stone-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Dashboard Overview</h1>
          <p className="text-stone-500 mt-1">Welcome back, here&apos;s what&apos;s happening at the boutique today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
          >
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
          <button
            type="button"
            className="px-4 py-2 bg-[#D4A5A5] text-white rounded-lg font-medium text-sm hover:bg-[#B88A8A] transition-colors flex items-center gap-2"
          >
            <span>+</span> New Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={data ? `$${data.total_revenue?.toLocaleString() ?? '0'}` : '$0'}
          change={data?.total_revenue_change ?? 0}
          changeLabel="Compared to last period"
          icon={<DollarIcon />}
        />
        <MetricCard
          title="Total Orders"
          value={data?.total_orders ?? 0}
          change={data?.total_orders_change ?? 0}
          changeLabel="Compared to last period"
          icon={<BagIcon />}
        />
        <MetricCard
          title="Most Popular Scent"
          value={data?.most_popular_scent?.name ?? 'N/A'}
          changeLabel={data?.most_popular_scent?.description}
          icon={<FlowerIcon />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone-800">Sales Trends</h2>
        <p className="text-sm text-stone-500 mb-4">
          {period === 'month' ? 'Monthly' : 'Weekly'} revenue performance
        </p>
        <SalesTrendChart data={data?.sales_trends} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-[#D4A5A5] hover:text-[#B88A8A] font-medium">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-100">
                  <th className="py-3 font-medium">ORDER ID</th>
                  <th className="py-3 font-medium">CUSTOMER</th>
                  <th className="py-3 font-medium">ITEMS</th>
                  <th className="py-3 font-medium">TOTAL</th>
                  <th className="py-3 font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_orders?.length ? (
                  data.recent_orders.map((order) => (
                    <tr key={order.id} className="border-b border-stone-50 hover:bg-stone-50/50">
                      <td className="py-3 font-medium">
                        <Link to={`/admin/orders`} className="text-[#D4A5A5] hover:underline">
                          #{order.order_id}
                        </Link>
                      </td>
                      <td className="py-3 text-stone-700">{order.customer_name}</td>
                      <td className="py-3 text-stone-600 truncate max-w-[140px]">{order.items}</td>
                      <td className="py-3 font-medium">${order.total.toFixed(2)}</td>
                      <td className="py-3">
                        <StatusBadge status={order.status} statusCode={order.status_code} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-1">Scent Popularity</h2>
          <p className="text-sm text-stone-500 mb-4">Sales distribution by fragrance</p>
          <ScentPopularityChart
            data={data?.scent_popularity}
            topLabel={data?.scent_popularity?.[0]?.name ?? 'N/A'}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Top Selling Bouquets</h2>
        <TopProductsList products={data?.top_products_by_sales} />
      </div>
    </div>
  )
}
