import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InventoryForm from '../components/inventory/InventoryForm'
import { createInventoryItem } from '../services/inventoryApi'

function AdminInventoryCreatePage() {
  const navigate = useNavigate()
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async ({ inventory_name, description }) => {
    setError('')
    setIsSubmitting(true)
    try {
      await createInventoryItem({ inventory_name, description, photo })
      navigate('/admin/inventory')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page">
      <header className="pageHeader">
        <h1>Створення позиції</h1>
        <Link className="btn" to="/admin/inventory">
          Назад
        </Link>
      </header>

      <InventoryForm
        initialValues={{ inventory_name: '', description: '' }}
        submitLabel="Створити"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        errorMessage={error}
      />

      <section className="card">
        <h2>Фото</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setPhoto(event.target.files?.[0] || null)}
        />
      </section>
    </main>
  )
}

export default AdminInventoryCreatePage
