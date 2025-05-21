import { getAllPortfolios } from '@/utils/actions';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import AssetsList from './AssetsList';

const PortfolioList = ({forceReRender}) => {
  const [portfolios, setPortfolios] = useState([])
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
      {portfolios.map((p)=>{ return (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <AssetsList name={p.name} forceReRender={forceReRender} />
        </div>  
      )})}
    </div>
  )
}
export default PortfolioList;
