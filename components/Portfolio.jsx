"use client";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { searchTickerQuote } from '@/utils/actions';
import SearchMatches from './SearchMatches';

const Portfolio = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [price, setPrice] = useState(Number(0.00))
  const [showModal, setShowModal] = useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: async (query) => {
      return searchTickerQuote(query);
    },
    onSuccess: (data) => {
      if(!data){
        toast.error('Something went wrong!');
        return
      }
      console.log(data)
    }
  });

  const handleTicker = (ticker) => {
    setSearchTerm(ticker)
  };
  
  const handleAddAsset = (e) => {
    e.preventDefault()
    mutate(searchTerm);
    setSearchTerm("")
  }
  return (
    <form className='sm:min-w-4xl mb-auto' onSubmit={handleAddAsset}>
      <div className='join join-vertical sm:join-horizontal w-full'>
        <SearchMatches handleTicker={handleTicker} />
        <div>
        <input 
          type="number" 
          className="input validator w-full text-left sm:w-24" 
          required 
          placeholder="Quantity" 
          min="1" max="10"
          title="Quantity" 
        />
        {/* <p className="validator-hint">Quantity must be a number</p> */}
        </div>
        <div>
          <input 
            type="number" 
            step="0.050"
            inputMode='decimal'
            className="input validator text-left w-full sm:w-24" 
            required 
            placeholder="Price" 
            min="1.00"
            title="Price" 
            value={price}
            onChange={(e)=>setPrice(Number(e.target.value))}
          />
          {/* <p className="validator-hint">Quantity must be a number</p> */}
        </div>
        <button 
          className='btn btn-primary join-item uppercase' 
          type='submit'
        >
          add asset
        </button>
      </div>
    </form>
  )
}

export default Portfolio
