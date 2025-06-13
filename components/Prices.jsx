'use client'
import React from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { getUniqueSymbols, searchTickerQuote, updateAssetPrice } from '@/utils/actions';

const Prices = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['uniqueSymbols'],
    queryFn: getUniqueSymbols,
  });
  const { mutate, isPending, data: quote } = useMutation({
    mutationFn: async (symbol) => {
      const newQuote = await searchTickerQuote(symbol);
      if(!newQuote){
        toast.error('No matching ticker found...')
        return null;
      }
      return newQuote;
    }
  })
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
  const handleClick = (symbol) => {
    mutate(symbol)
  }
  React.useEffect(() => {
    if (!isPending && quote) {
      const timestamp =  quote.is_market_open ? quote.last_quote_at : quote.timestamp;
      const newTime = new Date(timestamp * 1000);      
      const price = quote.is_market_open ? quote.open : quote.close
      update.mutate({ symbol: quote.symbol, quote: price, time: newTime });
      }
  }, [quote, isPending]);  // Depend on quote & isPending

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          
          {data?.map((item, idx)=>(
            <tr key={item.symbol}>
            <th>{idx + 1}</th>
            <td>{item.symbol}</td>
            <td>{item.price}</td>
            <td>{item.time.toISOString().slice(11,16)}</td>
            <td>
              <button className="btn btn-ghost" onClick={()=>handleClick(item.symbol)}>
                <FaCloudDownloadAlt />
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default Prices
