import React from 'react';
import { AiOutlinePercentage } from "react-icons/ai";

const AssetCard = ({ name, symbol, portfolioValue, quantity, type, price, spent }) => { 
  const currentValue = (quantity * Number(price)).toFixed(2)
  const percentage = Math.round(currentValue / portfolioValue * 100)
  return (
    <div className="card bg-base-100 w-full sm:w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          {name}
          <span className="badge badge-secondary cursor-pointer" data-asset={type === "crypto" ? symbol.slice(0,-4) : symbol} title="set search">({symbol})</span>
        </h2>
        <div className="card-actions justify-end">
          <div className="badge badge-error badge-dash">{ percentage }<AiOutlinePercentage /></div>
          {type !== "cash" && <><div className="badge badge-outline text-color-" title="Assets current value">{currentValue}</div>
          <div className="badge badge-outline" title="Total spent">{Number(spent).toFixed(2)}</div>
          <div className="badge badge-outline" title="Current price">{Number(price).toFixed(2)}</div></>}
          <div className="badge badge-outline" title="Quantity">{quantity}</div>
        </div>
      </div>
    </div>
  )
}
export default AssetCard;
