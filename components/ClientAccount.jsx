"use client";
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { searchTickerQuote } from '@/utils/actions';
import SearchMatches from './SearchMatches';
import HandleAsset from './HandleAsset';
import PortfolioList from './PortfolioList';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [asset, setAsset] = useState(null)
  const [error, setError] = useState(false)
  const [showAssetDialog, setShowAssetDialog] = useState(false)
  const [assetType, setAssetType] = useState("")
  const [operationType, setOperationType] = useState("buy")
  const modalRef = useRef(null)
  const getAsset = useMutation({
    mutationFn: async (query) => {
      return searchTickerQuote(query, assetType);
    },
    onSuccess: (data) => {
      if(data.status === "error"){
        setError(true)
        toast.error('Make sure asset type is correct!');
        clearInput();
        return
      }
      setAsset({...data, assetType: assetType})
      setShowAssetDialog(true)
    },
  });
  const handleAddAsset = async (e) => {
    e.preventDefault()
    setError(false)
    if(assetType !== "cash") {
      getAsset.mutate(searchTerm)
    } else {
       setAsset({
        name: "US Dollar",
        close: 1,
        symbol: "$",
        currency: "USD",
        assetType: "cash"
      });
      setShowAssetDialog(true)
    }
  }
  const clearInput = () => {
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
              className='btn btn-primary rounded-bl-md sm:rounded-none w-1/2 uppercase box-border' 
              type='submit'
              onClick={()=>setOperationType("buy")}
            >
              {assetType !== "cash" ? "buy" : "add"}
            </button>
            <button 
              className='btn btn-primary rounded-br-md sm:rounded-e-md w-1/2 uppercase box-border' 
              type='submit'
              onClick={()=>setOperationType("sell")}
            >
              {assetType !== "cash" ? "sell" : "withdraw"}
            </button>
          </div>
        </div>
      </form>
      {
        showAssetDialog && <HandleAsset 
          asset={asset} 
          assetPrice={asset?.close}
          ref={modalRef}
          toggleModal={setShowAssetDialog}
          clearInput={clearInput}
          type={operationType}
        />
      }
      <PortfolioList forceReRender={showAssetDialog} handleQuery={setSearchTerm} />
    </div>
  )
}

export default Portfolio
