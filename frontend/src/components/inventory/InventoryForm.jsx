import { useState } from 'react'

function InventoryForm({
  initialValues,
  submitLabel,
  onSubmit,
  isSubmitting,
  errorMessage,
}) {
  const [inventoryName, setInventoryName] = useState(initialValues.inventory_name || '')
  const [description, setDescription] = useState(initialValues.description || '')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedName = inventoryName.trim()

    if (!trimmedName) {
      setLocalError("Назва інвентарю обов'язкова")
      return
    }

    setLocalError('')
    await onSubmit({ inventory_name: trimmedName, description })
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Дані інвентарю</h2>

      <label className="fieldLabel" htmlFor="inventory_name">
        Назва інвентарю
      </label>
      <input
        id="inventory_name"
        className="input"
        value={inventoryName}
        onChange={(event) => setInventoryName(event.target.value)}
      />

      <label className="fieldLabel" htmlFor="description">
        Опис
      </label>
      <textarea
        id="description"
        className="textarea"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={5}
      />

      {(localError || errorMessage) && (
        <p className="errorText">{localError || errorMessage}</p>
      )}

      <button className="btn btnPrimary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Збереження...' : submitLabel}
      </button>
    </form>
  )
}

export default InventoryForm
