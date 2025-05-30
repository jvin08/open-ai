import React from 'react';

const AssetCard = ({ name, symbol, totalValue, quantity, type, price }) => { 
  return (
    <div className="card bg-base-100 w-full sm:w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          {name}
          <div className="badge badge-secondary">({symbol})</div>
        </h2>
        <div className="card-actions justify-end">
          {type !== "cash" && <><div className="badge badge-outline text-color-" title="Assets current value">{(quantity * Number(price)).toFixed(2)}</div>
          <div className="badge badge-outline" title="Total spent">{Number(totalValue).toFixed(2)}</div>
          <div className="badge badge-outline" title="Current price">{Number(price).toFixed(2)}</div></>}
          <div className="badge badge-outline" title="Quantity">{quantity}</div>
        </div>
      </div>
    </div>
  )
}
export default AssetCard;
