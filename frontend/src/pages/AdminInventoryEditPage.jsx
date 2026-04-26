import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import InventoryForm from '../components/inventory/InventoryForm'
import {
  fetchInventoryItem,
  updateInventoryPhoto,
  updateInventoryText,
} from '../services/inventoryApi'

function AdminInventoryEditPage() {
  const { id } = useParams()

  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [textError, setTextError] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [isTextSubmitting, setIsTextSubmitting] = useState(false)
  const [isPhotoSubmitting, setIsPhotoSubmitting] = useState(false)
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    const loadItem = async () => {
      setIsLoading(true)
      setLoadError('')
      try {
        const data = await fetchInventoryItem(id)
        setItem(data)
      } catch (error) {
        setLoadError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadItem()
  }, [id])

  const handleTextSubmit = async ({ inventory_name, description }) => {
    setTextError('')
    setIsTextSubmitting(true)
    try {
      const updated = await updateInventoryText(id, { inventory_name, description })
      setItem(updated)
    } catch (error) {
      setTextError(error.message)
    } finally {
      setIsTextSubmitting(false)
    }
  }

  const handlePhotoSubmit = async (event) => {
    event.preventDefault()
    if (!photo) {
      setPhotoError('Оберіть файл для оновлення фото')
      return
    }

    setPhotoError('')
    setIsPhotoSubmitting(true)
    try {
      const updated = await updateInventoryPhoto(id, photo)
      setItem(updated)
      setPhoto(null)
    } catch (error) {
      setPhotoError(error.message)
    } finally {
      setIsPhotoSubmitting(false)
    }
  }

  return (
    <main className="page">
      <header className="pageHeader">
        <h1>Редагування інвентарю</h1>
        <Link className="btn" to="/admin/inventory">
          Назад
        </Link>
      </header>

      {isLoading && <p className="state">Завантаження...</p>}
      {loadError && <p className="state errorText">Помилка: {loadError}</p>}

      {!isLoading && !loadError && item && (
        <>
          <InventoryForm
            key={item.id}
            initialValues={{ inventory_name: item.inventory_name, description: item.description || '' }}
            submitLabel="Оновити текстові дані"
            isSubmitting={isTextSubmitting}
            onSubmit={handleTextSubmit}
            errorMessage={textError}
          />

          <form className="card" onSubmit={handlePhotoSubmit}>
            <h2>Оновлення фотографії</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
            />
            {photoError && <p className="errorText">{photoError}</p>}
            <button className="btn btnPrimary" type="submit" disabled={isPhotoSubmitting}>
              {isPhotoSubmitting ? 'Оновлення...' : 'Оновити фото'}
            </button>
          </form>
        </>
      )}
    </main>
  )
}

export default AdminInventoryEditPage
