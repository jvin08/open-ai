import { getAllPortfolios, getUserAssets } from '@/utils/actions';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import AssetsList from './AssetsList';
import { useAuth } from "@clerk/nextjs";

const PortfolioList = ({forceReRender}) => {
  const { userId } = useAuth();
  const [showTotal, setShowTotal] = useState(true)
  const [portfolios, setPortfolios] = useState([])
  const { data, isLoading } = useQuery({
    queryKey: ['assets', userId],
    queryFn: async() => {
      const data = await getUserAssets(userId)
      return data
    },
  });

  const totalValue = data?.reduce((acc,val)=> {
    acc.total = acc.total + Number(val.assetQuantity) * Number(val.lastPrice)
    acc.gain = acc.gain + Number(val.assetQuantity) * (Number(val.lastPrice) - Number(val.assetPrice))
    return acc
  }, { total:0, gain:0 })
  // assetName :  "iShares Bitcoin Trust"
  // assetPrice :  "59.7403"
  // assetQuantity :  "1.00"
  // assetSymbol :  "IBIT"
  // assetType :  "stock"
  // clerkId :  "user_2w0UhcWsJJaK8r9edFyduBowtAV"
  // id :  "b0d23309-8f93-4c3e-986d-f11536bb058e"
  // lastPrice :  "61.80000"
  // portfolioName :  "animals"
  
  const getPortfolios = useMutation({
    mutationFn: async () => {
      return getAllPortfolios();
    },
    onSuccess: (data) => {
      if(!data){
        toast.error('Portfolios list went wrong!');
        return
      }
      console.log("portfolio: ", data)
      setPortfolios(data);
    }
  });
  const handleTotal = () => {
    setShowTotal(t => !t)
  }
  const formatNumber = (num) => {
    return num?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(()=>getPortfolios.mutate(),[])
  const gainStyle = totalValue?.gain < 0 ? "badge badge-lg badge-error ml-2" : "badge badge-lg badge-accent ml-2"
  return (
    <div  className='py-4'>
      {showTotal ? <button className="btn btn-success my-2" onClick={handleTotal}>
        Total value: <div className="badge badge-lg badge-accent ml-2">{formatNumber(totalValue?.total)}</div>
      </button>
      : <button className="btn btn-success my-2" onClick={handleTotal}>
        Gain/Loss: <div className={gainStyle}>{formatNumber(totalValue?.gain)}</div>
      </button>
      }
      <span className='flex ml-[178px] w-48 text-center font-light italic text-gray-600'>
        <p className='w-[50%]'>gain / loss</p>
        <p className='w-[50%]'>total value</p>
      </span>
      {portfolios.map((p)=>{ return (
        <div key={p.id}>
          <AssetsList name={p.name} forceReRender={forceReRender} />
        </div>  
      )})}
    </div>
  )
}
export default PortfolioList;
