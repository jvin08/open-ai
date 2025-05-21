import React from 'react'

const AssetCard = ({name, symbol, price, quantity}) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          {name}
          <div className="badge badge-secondary">({symbol})</div>
        </h2>
        <div className="card-actions justify-end">
          <div className="badge badge-outline" title="total value">{price * quantity}</div>
          <div className="badge badge-outline" title="purchase price">{price}</div>
          <div className="badge badge-outline" title="quantity">{quantity}</div>
        </div>
      </div>
    </div>
  )
}
export default AssetCard;
