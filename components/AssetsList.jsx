import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { getAssetsByPortfolioName, portfolioValue, searchTickerQuote } from '@/utils/actions';
import { useAuth } from '@clerk/nextjs';
import AssetCard from './AssetCard';
import { Triangle } from './Triangle';

const AssetsList = ({name, forceReRender}) => {
  
  const { userId } = useAuth()
  const [assets, setAssets] = useState([])
  const [symbols, setSymbols] = useState("")
  const [additionalData, setAdditionalData] = useState("")
  const [isVisible, setIsVisible] = useState(false);
  const [gain, setGain] = useState("")
  const [totalValue, setTotalValue] = useState(0);
  const { mutate, isPending } = useMutation({
    mutationFn: async (query) => {
      return getAssetsByPortfolioName(query, userId);
    },
    onSuccess: (data) => {
      if(!data){
        toast.error('Assets list went wrong!');
        return;
      }
      const uniqueItems = Object.values(
        data.reduce((acc, item) => {
          if (!acc[item.assetName]) {
            acc[item.assetName] = { 
              id: item.id, 
              name: item.assetName, 
              symbol: item.assetSymbol, 
              type: item.assetType,
              totalQuantity: 0, 
              totalValue: 0 
            };
          }
          acc[item.assetName].totalQuantity += Number(item.assetQuantity);
          acc[item.assetName].totalValue += Number(item.assetPrice) * Number(item.assetQuantity);
          return acc;
        }, {})
      );
      const symbols = uniqueItems.map((item)=>item.symbol).filter(i=>i!=="$").join(",");
      setSymbols(symbols)
      
      setAssets(uniqueItems);
    }
  });
  const toggleList = () => {
    setIsVisible(isVisible => !isVisible)
  }
  useEffect(() => {
    mutate(name)
  },[name, forceReRender])
  useEffect(() => {
    const fetchAdditionalData = async () => {
    if (symbols.length > 0) {
      const data = await searchTickerQuote(symbols, "stock");
      //transform data into object like {symbolName: assetClosingPrice}
      const transformData = (data) =>
        Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = value.close;
          return acc;
        }, {});
      const adoptedData = Object.keys(data).includes("symbol") ? {[data.symbol]: data.close} : transformData(data);      
      setAdditionalData(adoptedData);
      const currentValue = await portfolioValue(assets, adoptedData)
      const spentOnInvestments = assets.reduce((acc, asset)=>acc + asset.totalValue,0)
      setGain((currentValue - spentOnInvestments).toFixed(2))
      setTotalValue(currentValue.toFixed(2))
    }
  };
  fetchAdditionalData();
}, [symbols]); // Runs only once on mount
  const adjuster = gain.startsWith("-")
  const color = adjuster ? "red" : "green";
  const gainOrLossStyle = `text-${color}-600 w-[50%] text-center flex items-center justify-center`;
  return (
    <>
      {assets.length > 0 && 
        <div className='py-1 w-[370px] flex items-center justify-between'>
          <button className='btn btn-lg btn-info mr-auto' onClick={toggleList}>{name}</button>
          <div className='w-48 flex justify-between'>
            <span className={gainOrLossStyle}>
              <Triangle color={color} />
              { gain.slice(1) }
            </span>
            <p className='text-accent-content w-[50%] text-center'>{ totalValue }</p>
          </div>
        </div>}
      <ul className={isVisible ? '' : 'hidden'}>
        {assets.map((a, i)=><li key={a.id} className='py-4'>
          <AssetCard 
            sumTotal={setTotalValue}
            name={a.name} 
            symbol={a.symbol} 
            quantity={a.totalQuantity} 
            totalValue={a.totalValue} 
            type={a.type}
            price={additionalData[a.symbol]}
          />
        </li>)}
      </ul>
    </>
  )
}

export default AssetsList
