import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { getAssetsByPortfolioName } from '@/utils/actions';
import { useAuth } from '@clerk/nextjs';
import AssetCard from './AssetCard';

const AssetsList = ({name, forceReRender}) => {
  const { userId } = useAuth()
  const [assets, setAssets] = useState([])
  const { mutate, isPending } = useMutation({
    mutationFn: async (query) => {
      return getAssetsByPortfolioName(query, userId);
    },
    onSuccess: (data) => {
      if(!data){
        toast.error('Assets list went wrong!');
        return;
      }
      console.log(data)
      setAssets(data);
    }
  });
  useEffect(() => {
    mutate(name)
  },[name, forceReRender])
  return (
    <ul>
      {/*<p className='font-thin'>{a.assetName} ({a.assetSymbol})</p>  */}
      {assets.map((a, i)=><li key={a.id} className='py-4'>
        <AssetCard name={a.assetName} symbol={a.assetSymbol} price={a.assetPrice} quantity={a.assetQuantity}/>
      </li>)}
    </ul>
  )
}

export default AssetsList
