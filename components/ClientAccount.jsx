"use client";
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { searchTickerQuote } from '@/utils/actions';
import SearchMatches from './SearchMatches';
import HandleAsset from './HandleAsset';
import PortfolioList from './PortfolioList';

const Portfolio = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [price, setPrice] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const [asset, setAsset] = useState(null)
  const [showAssetDialog, setShowAssetDialog] = useState(false)
  const [assetType, setAssetType] = useState("")
  const [operationType, setOperationType] = useState("buy")
  const modalRef = useRef(null)
  const getAsset = useMutation({
    mutationFn: async (query) => {
      return searchTickerQuote(query, assetType);
    },
    onSuccess: (data) => {
      if(!data){
        toast.error('Something went wrong!');
        return
      }
      setAsset({...data, assetType: assetType})
    }
  });
  const handleAddAsset = async (e) => {
    e.preventDefault()
    assetType !== "cash" ? getAsset.mutate(searchTerm) : setAsset({
      name: "US Dollar",
      close: 1,
      symbol: "$",
      currency: "USD",
      assetType: "cash"
    });
    setShowAssetDialog(true)
  }
  const clearInput = () => {
    setPrice(1)
    setQuantity(1)
    setSearchTerm("")
    setAssetType("")
  }
  useEffect(()=>{
    showAssetDialog && modalRef.current.showModal();
  }, [showAssetDialog])
  return (
    <div className='mb-auto -mt-6 sm:mt-10'>
      <form className='w-48 sm:min-w-4xl' onSubmit={handleAddAsset}>
        <div className='join join-vertical sm:join-horizontal w-full'>
          <SearchMatches 
            disabled={assetType === "cash"}
            searchTerm={searchTerm}
            handleInput={setSearchTerm}
          />
          <div>
          <input 
            type="number" 
            className="input validator w-full text-left sm:w-24" 
            required 
            placeholder="Quantity" 
            min="0"
            title="Quantity" 
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
          />
          {/* <p className="validator-hint">Quantity must be a number</p> */}
          </div>
          <div>
            <input 
              type="number" 
              step="0.01"
              inputMode='decimal'
              className="input validator text-left w-full sm:w-24" 
              required 
              placeholder="Price" 
              min="0"
              title="Price" 
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
            />
          </div>
          <select value={assetType} 
                  className="select w-full flex" 
                  onChange={(e)=>setAssetType(e.target.value)}
                  required
          >
            <option disabled value="">asset type</option>
            <option>stock</option>
            <option>crypto</option>
            <option>cash</option>
          </select>
          <div className='flex justify-between'>
            <button 
              className='btn btn-primary join-item uppercase box-border' 
              type='submit'
              onClick={()=>setOperationType("buy")}
            >
              Buy
            </button>
            <button 
              className='btn btn-primary join-item uppercase box-border' 
              type='submit'
              onClick={()=>setOperationType("sell")}
            >
              Sell
            </button>
          </div>
        </div>
      </form>
      {
        showAssetDialog && <HandleAsset 
          asset={asset} 
          quantity={quantity}
          ref={modalRef}
          toggleModal={setShowAssetDialog}
          clearInput={clearInput}
          type={operationType}
        />
      }
      <PortfolioList forceReRender={showAssetDialog} />
    </div>
  )
}

export default Portfolio
