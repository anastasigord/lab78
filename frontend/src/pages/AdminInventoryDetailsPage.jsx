import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import InventoryDetailsView from '../components/inventory/InventoryDetailsView'
import { fetchInventoryItem } from '../services/inventoryApi'

function AdminInventoryDetailsPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadItem = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await fetchInventoryItem(id)
        setItem(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadItem()
  }, [id])

  return (
    <main className="page">
      <header className="pageHeader">
        <h1>Деталі інвентарю</h1>
        <Link className="btn" to="/admin/inventory">
          Назад
        </Link>
      </header>

      {isLoading && <p className="state">Завантаження...</p>}
      {error && <p className="state errorText">Помилка: {error}</p>}
      {!isLoading && !error && item && <InventoryDetailsView item={item} />}
    </main>
  )
}

export default AdminInventoryDetailsPage
