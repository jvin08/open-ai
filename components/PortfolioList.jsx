import { getUserPortfolios, getUserAssets } from '@/utils/actions';
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
    queryFn: () => {
      const data = getUserAssets(userId)
      return data
    },
  });

  const totalValue = data?.reduce((acc,val)=> {
    acc.total = acc.total + Number(val.assetQuantity) * Number(val.lastPrice)
    acc.gain = acc.gain + Number(val.assetQuantity) * (Number(val.lastPrice) - Number(val.assetPrice))
    return acc
  }, { total:0, gain:0 })

  const getPortfolios = useMutation({
    mutationFn: async (id) => getUserPortfolios(id),
    onSuccess: (data) => {
      if(!data){
        toast.error('Portfolios list went wrong!');
        return
      }
      setPortfolios(data);
    }
  });
  const handleTotal = () => {
    setShowTotal(t => !t)
  }
  const formatNumber = (num) => {
    return num?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => getPortfolios.mutate("user_2w5hfPMP72XkAvUQxTguk2X3cZV"),[])
  const gainStyle = totalValue?.gain < 0 ? "badge badge-lg badge-error ml-2" : "badge badge-lg badge-accent ml-2"
  return (
    <div  className='py-4'>
      {showTotal ? <button className="btn btn-success my-2" onClick={handleTotal}>
        Total value: { isLoading
          ? <progress className="progress w-[91px] bg-teal-700/20 progress-accent px-6"></progress> 
          : <div className="badge badge-lg badge-accent ml-2">{formatNumber(totalValue?.total)}</div>
        }
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
          <AssetsList name={p.portfolioName} forceReRender={forceReRender} />
        </div>  
      )})}
    </div>
  )
}
export default PortfolioList;
