import React from 'react';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import Prices from '@/components/Prices';

const PricesPage = () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Prices />
    </HydrationBoundary>
  )
}

export default PricesPage
