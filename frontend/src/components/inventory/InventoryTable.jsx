import { Link } from 'react-router-dom'
import { getImageUrl } from '../../services/inventoryApi'

function InventoryTable({ items, onDelete }) {
  return (
    <div className="tableWrapper">
      <table className="inventoryTable">
        <thead>
          <tr>
            <th>Назва інвентарю</th>
            <th>Опис</th>
            <th>Фото</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.inventory_name}</td>
              <td>{item.description || '—'}</td>
              <td>
                {item.photo_url ? (
                  <img
                    className="thumb"
                    src={getImageUrl(item.photo_url)}
                    alt={item.inventory_name}
                  />
                ) : (
                  <span className="muted">Немає фото</span>
                )}
              </td>
              <td>
                <div className="actions">
                  <Link className="btn" to={`/admin/inventory/${item.id}`}>
                    Переглянути
                  </Link>
                  <Link className="btn" to={`/admin/inventory/${item.id}/edit`}>
                    Редагувати
                  </Link>
                  <button
                    className="btn btnDanger"
                    type="button"
                    onClick={() => onDelete(item)}
                  >
                    Видалити
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryTable
