import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-800 flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
