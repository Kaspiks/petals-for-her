import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ProductsPage from './pages/ProductsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyAccountPage from './pages/VerifyAccountPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ContactUsPage from './pages/ContactUsPage'
import AdminRoute from './components/admin/AdminRoute'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import OrdersPage from './pages/admin/OrdersPage'
import AdminProductsPage from './pages/admin/ProductsPage'
import ConfigurationPage from './pages/admin/ConfigurationPage'
import CustomersPage from './pages/admin/CustomersPage'
import UsersPage from './pages/admin/UsersPage'
import AddProductPage from './pages/admin/AddProductPage'
import AdminProductPage from './pages/admin/ProductPage'
import EditProductPage from './pages/admin/EditProductPage'
import ProductOptionsPage from './pages/admin/ProductOptionsPage'

function App() {
  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-800">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyAccountPage />} />
        <Route path="/privacy_policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/contact_us" element={<ContactUsPage />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="products/:id" element={<AdminProductPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="analytics" element={<Navigate to="/admin" replace />} />
          <Route path="configuration" element={<ConfigurationPage />} />
          <Route path="product-options" element={<ProductOptionsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
