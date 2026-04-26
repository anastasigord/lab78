function ConfirmModal({
  title,
  description,
  onConfirm,
  onCancel,
  isLoading,
}) {
  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true">
      <div className="modalCard">
        <h3>{title}</h3>
        <p>{description}</p>

        <div className="actions">
          <button
            className="btn"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Скасувати
          </button>
          <button
            className="btn btnDanger"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Видалення...' : 'Підтвердити'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
