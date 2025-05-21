import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { getAssetsByPortfolioName } from '@/utils/actions';
import { useAuth } from '@clerk/nextjs';

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
      setAssets(data);
    }
  });
  useEffect(() => {
    mutate(name)
  },[name, forceReRender])
  return (
    <ul>
      {assets.map((a, i)=><li key={a.id}><p className='font-thin'>{a.assetName} ({a.assetSymbol})</p></li>)}
    </ul>
  )
}

export default AssetsList
