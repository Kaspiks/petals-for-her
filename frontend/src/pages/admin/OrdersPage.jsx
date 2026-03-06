import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import StatusBadge from '../../components/admin/StatusBadge'

export default function OrdersPage() {
  const { fetchWithAuth } = useAuth()
  const [orders, setOrders] = useState([])
  const [statuses, setStatuses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)
  const perPage = 25

  useEffect(() => {
    async function fetchStatuses() {
      const res = await fetchWithAuth('/api/v1/admin/order_statuses')
      if (res.ok) {
        const data = await res.json()
        setStatuses(data)
      }
    }
    fetchStatuses()
  }, [fetchWithAuth])

  const [searchDebounced, setSearchDebounced] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(timer)
  }, [search])
  useEffect(() => {
    setPage(1)
  }, [searchDebounced])

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page, per_page: perPage })
        if (statusFilter) params.set('status_id', statusFilter)
        if (searchDebounced.trim()) params.set('q', searchDebounced.trim())
        const res = await fetchWithAuth(`/api/v1/admin/orders?${params}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders)
          setTotal(data.total)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [fetchWithAuth, page, statusFilter, searchDebounced])

  async function fetchOrderDetail(id) {
    const res = await fetchWithAuth(`/api/v1/admin/orders/${id}`)
    if (res.ok) {
      const data = await res.json()
      setSelectedOrder(data)
    }
  }

  async function updateOrderStatus(orderId, statusId) {
    setUpdating(true)
    try {
      const res = await fetchWithAuth(`/api/v1/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ order_status_id: statusId }),
      })
      if (res.ok) {
        const updated = await res.json()
        setSelectedOrder(updated)
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: updated.status, status_code: updated.status_code } : o))
        )
      }
    } finally {
      setUpdating(false)
    }
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-stone-800 mb-2">Orders</h1>
      <p className="text-stone-500 mb-6">Manage and track customer orders.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by order ID, customer, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 placeholder-stone-400 focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:ring-2 focus:ring-[#D4A5A5]/30"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 bg-stone-50 border-b border-stone-100">
                <th className="py-3 px-4 font-medium">ORDER ID</th>
                <th className="py-3 px-4 font-medium">CUSTOMER</th>
                <th className="py-3 px-4 font-medium">ITEMS</th>
                <th className="py-3 px-4 font-medium">DATE</th>
                <th className="py-3 px-4 font-medium">STATUS</th>
                <th className="py-3 px-4 font-medium">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    Loading...
                  </td>
                </tr>
              ) : orders.length ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer"
                    onClick={() => fetchOrderDetail(order.id)}
                  >
                    <td className="py-3 px-4 font-medium text-[#D4A5A5]">#{order.order_id}</td>
                    <td className="py-3 px-4 text-stone-700">{order.customer_name}</td>
                    <td className="py-3 px-4 text-stone-600 truncate max-w-[180px]">{order.items}</td>
                    <td className="py-3 px-4 text-stone-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.status} statusCode={order.status_code} />
                    </td>
                    <td className="py-3 px-4 font-medium">${order.total?.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-stone-100">
            <p className="text-sm text-stone-500">
              Page {page} of {totalPages} ({total} orders)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded border border-stone-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border border-stone-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">
                Order #{selectedOrder.order_id}
              </h2>
              <div className="space-y-2 text-sm mb-4">
                <p><span className="text-stone-500">Customer:</span> {selectedOrder.customer_name || selectedOrder.email}</p>
                <p><span className="text-stone-500">Email:</span> {selectedOrder.email}</p>
                {selectedOrder.shipping_address && (
                  <p><span className="text-stone-500">Shipping:</span> {selectedOrder.shipping_address}</p>
                )}
                <p><span className="text-stone-500">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-600 mb-2">Status</label>
                <select
                  value={selectedOrder.status_code}
                  onChange={(e) => {
                    const s = selectedOrder.available_statuses?.find((x) => x.code === e.target.value)
                    if (s) updateOrderStatus(selectedOrder.id, s.id)
                  }}
                  disabled={updating}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                >
                  {selectedOrder.available_statuses?.map((s) => (
                    <option key={s.id} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="border-t border-stone-100 pt-4">
                <p className="text-sm font-medium text-stone-600 mb-2">Items</p>
                <ul className="space-y-2">
                  {selectedOrder.order_items?.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span>{item.product_name} x{item.quantity}</span>
                      <span>${item.subtotal?.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-semibold text-stone-800 text-right">
                  Total: ${selectedOrder.total?.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 w-full py-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
