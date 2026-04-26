import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmModal from '../components/inventory/ConfirmModal'
import InventoryTable from '../components/inventory/InventoryTable'
import { deleteInventoryItem, fetchInventoryList } from '../services/inventoryApi'

function AdminInventoryPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedForDelete, setSelectedForDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isEmpty = useMemo(
    () => !isLoading && !error && items.length === 0,
    [isLoading, error, items],
  )

  useEffect(() => {
    const loadInitialItems = async () => {
      try {
        const data = await fetchInventoryList()
        setItems(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialItems()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) return

    setIsDeleting(true)
    setError('')
    try {
      await deleteInventoryItem(selectedForDelete.id)
      setItems((prevItems) => prevItems.filter((item) => item.id !== selectedForDelete.id))
      setSelectedForDelete(null)
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="page">
      <header className="pageHeader">
        <h1>Адмін-панель інвентарю</h1>
        <Link className="btn btnPrimary" to="/admin/inventory/create">
          Додати позицію
        </Link>
      </header>

      {isLoading && <p className="state">Завантаження...</p>}
      {error && <p className="state errorText">Помилка: {error}</p>}

      {!isLoading && !error && <InventoryTable items={items} onDelete={setSelectedForDelete} />}
      {isEmpty && <p className="state">Список порожній. Додайте першу позицію.</p>}

      {selectedForDelete && (
        <ConfirmModal
          title="Підтвердіть видалення"
          description={`Видалити ${selectedForDelete.inventory_name}?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setSelectedForDelete(null)}
          isLoading={isDeleting}
        />
      )}
    </main>
  )
}

export default AdminInventoryPage
