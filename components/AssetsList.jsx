import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { getAssetsByPortfolioName, portfolioValue, searchTickerQuote } from '@/utils/actions';
import { useAuth } from '@clerk/nextjs';
import AssetCard from './AssetCard';
import { Triangle } from './Triangle';

const AssetsList = ({name, forceReRender}) => {
  const { userId } = useAuth()  
  const [isVisible, setIsVisible] = useState(false);
  const [gain, setGain] = useState("")
  const [totalValue, setTotalValue] = useState(0);
  const [assets, setAssets] = useState([])
  const [cash, setCash] = useState(0)
  const { mutate, isPending } = useMutation({
    mutationFn: async (query) => {
      return getAssetsByPortfolioName(query, userId);
    },
    onSuccess: (data) => {
      if(!data){
        toast.error('Assets list went wrong!');
        return;
      }
      const filteredData = data.filter(asset => asset.assetType !== "cash")
      const cashData = data.filter(asset => asset.assetType === "cash")
      setCash(cashData[0]?.assetQuantity)
      const uniqueItems = Object.values(
        filteredData.reduce((acc, item) => {
          if (!acc[item.assetName]) {
            acc[item.assetName] = { 
              id: item.id, 
              name: item.assetName, 
              symbol: item.assetSymbol, 
              type: item.assetType,
              totalQuantity: 0, 
              totalSpent: 0 ,
              totalValueNow: 0,
              price: item.lastPrice || 1,
            };
          }
          acc[item.assetName].totalQuantity += Number(item.assetQuantity);
          acc[item.assetName].totalValueNow += Number(item.lastPrice) * Number(item.assetQuantity);
          acc[item.assetName].totalSpent += Number(item.assetPrice) * Number(item.assetQuantity);
          return acc;
        }, {})
      );
      const currentValue = uniqueItems.reduce((acc, asset)=>acc + asset.totalValueNow,0)
      const spentOnInvestments = uniqueItems.reduce((acc, asset)=>acc + asset.totalSpent,0)  
      setGain((currentValue - spentOnInvestments).toFixed(2))
      setTotalValue(currentValue.toFixed(2))
      setAssets(uniqueItems);
      return  uniqueItems
    }
  });
  const toggleList = () => {
    setIsVisible(isVisible => !isVisible)
  }
  useEffect(() => {
    mutate(name)
  },[name, forceReRender])

  const adjuster = gain.startsWith("-")
  const adjusterZero = gain.startsWith("-0.00")
  const color = adjuster ? adjusterZero ? "gray" : "red" : "green";
  const gainOrLossStyle = adjuster ? adjusterZero ? "text-gray-500" : "text-red-500" : "text-green-500";
  const gainForRender = adjuster ? gain.slice(1) : gain
  const cashStyle = isVisible ? "text-base font-semibold text-right mt-2 w-full" : "hidden" 
  return (
    <>
      {assets?.length > 0 && 
        <div className='py-1 w-[370px] flex items-center justify-between'>
          <button className='btn btn-lg btn-info mr-auto' onClick={toggleList}>{name}</button>
          <div className='w-48 flex justify-between'>
            <span className="w-[50%] text-center flex items-center justify-center">
              {color !== "gray" && <Triangle color={color} />}
              <span className={gainOrLossStyle}>{ gainForRender }</span>
            </span>
            <p className='text-accent-content w-[50%] text-center'>{ totalValue }</p>
          </div>
        </div>}
      <h3 className={cashStyle}>
        Funds available to trade <span className="badge badge-md">{cash}</span>
      </h3>
      <ul className={isVisible ? '' : 'hidden'}>
        {assets?.map((a)=><li key={a.id} className='py-4'>
          <AssetCard 
            name={a.name} 
            symbol={a.symbol} 
            quantity={a.totalQuantity} 
            portfolioValue={totalValue} 
            type={a.type}
            price={a.price}
            spent={a.totalSpent}
          />
        </li>)}
      </ul>
    </>
  )
}

export default AssetsList
