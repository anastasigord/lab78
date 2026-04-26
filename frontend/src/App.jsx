import { Navigate, Route, Routes } from 'react-router-dom'
import AdminInventoryCreatePage from './pages/AdminInventoryCreatePage'
import AdminInventoryDetailsPage from './pages/AdminInventoryDetailsPage'
import AdminInventoryEditPage from './pages/AdminInventoryEditPage'
import AdminInventoryPage from './pages/AdminInventoryPage'
import './styles/admin.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/inventory" replace />} />
      <Route path="/admin/inventory" element={<AdminInventoryPage />} />
      <Route path="/admin/inventory/create" element={<AdminInventoryCreatePage />} />
      <Route path="/admin/inventory/:id/edit" element={<AdminInventoryEditPage />} />
      <Route path="/admin/inventory/:id" element={<AdminInventoryDetailsPage />} />
    </Routes>
  )
}

export default App
