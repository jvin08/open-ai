'use client'
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { getUniqueSymbols, searchTickerQuote, updateAssetPrice } from '@/utils/actions';
import toast from 'react-hot-toast';
import { useAuth } from "@clerk/nextjs";

const Prices = () => {
  const { userId } = useAuth();   
  const queryClient = useQueryClient()
  const [fetchingQuote, setFetchingQuote] = useState("")
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  const { data, isLoading } = useQuery({
    queryKey: ['uniqueSymbols'],
    queryFn: ()=>getUniqueSymbols(userId),
  });
  const update = useMutation({
    mutationFn: async ({symbol, quote, time}) => {
      const updated = await updateAssetPrice(symbol, quote, time);
      if(!updated){
        toast.error('No matching ticker found...')
        return null;
      }
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["uniqueSymbols"]); // Refetch table data
    }
  })
  const autoUpdateAllSymbols = async () => {
    if (!data || data.length === 0) return;
    const symbols = data.map(item => item.symbol);
    for (let i = 0; i < symbols.length; i++) {
      if (i < symbols.length - 1) await delay(7500);
      const symbol = symbols[i];
      setFetchingQuote(symbol)
      toast.success("Loading quote for " + symbol + "...");
      const quote = await searchTickerQuote(symbol);
      if (!quote) {
        toast.error(`No quote found for ${symbol}`);
        continue;
      }
      const timestamp = quote.is_market_open ? quote.last_quote_at : quote.timestamp;
      const price = quote.is_market_open ? quote.open : quote.close;
      const newTime = new Date(timestamp * 1000);
      await updateAssetPrice(symbol, price, newTime);
      queryClient.invalidateQueries(['uniqueSymbols']);
    }
    toast.success('All symbols updated!');
    setFetchingQuote("")
  };
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mb-auto mt-8">
      <table className="table">
        <thead>
          <tr>
            <th>
              <button className='btn btn-circle' onClick={autoUpdateAllSymbols} title='update prices'>
                {fetchingQuote !== "" ? <span className="loading loading-spinner"></span> : <FaCloudDownloadAlt />}
              </button>
            </th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>          
          {data?.map((item, idx)=>(
            <tr key={item.symbol} className={`transition-colors duration-[7500ms] ${fetchingQuote === item.symbol ? "bg-[#64533d]" : ""}`}>
              <th className='text-center'>{idx + 1}</th>
              <td>{item.symbol}</td>
              <td>{item.price}</td>
              <td className='font-light text-xs'>{item.time.toLocaleString().slice(0,16)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default Prices
