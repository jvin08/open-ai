import { getAllPortfolios, getUserAssets } from '@/utils/actions';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import AssetsList from './AssetsList';
import { useAuth } from "@clerk/nextjs";

const PortfolioList = ({forceReRender}) => {
  const { userId } = useAuth();
  const [portfolios, setPortfolios] = useState([])
  const { data, isLoading } = useQuery({
    queryKey: ['assets', userId],
    queryFn: async() => {
      const data = await getUserAssets(userId)
      return data
    },
  });
  const getPortfolios = useMutation({
    mutationFn: async () => {
      return getAllPortfolios();
    },
    onSuccess: (data) => {
      if(!data){
        toast.error('Portfolios list went wrong!');
        return
      }
      setPortfolios(data);
    }
  });
  useEffect(()=>getPortfolios.mutate(),[])
  return (
    <div  className='py-4'>
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
