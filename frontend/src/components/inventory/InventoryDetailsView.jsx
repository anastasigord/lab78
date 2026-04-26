import { getImageUrl } from '../../services/inventoryApi'

function InventoryDetailsView({ item }) {
  return (
    <div className="card">
      <h2>{item.inventory_name}</h2>
      <p className="detailsDescription">{item.description || 'Опис відсутній'}</p>

      {item.photo_url ? (
        <img
          className="detailsImage"
          src={getImageUrl(item.photo_url)}
          alt={item.inventory_name}
        />
      ) : (
        <div className="imagePlaceholder">Немає зображення</div>
      )}
    </div>
  )
}

export default InventoryDetailsView
