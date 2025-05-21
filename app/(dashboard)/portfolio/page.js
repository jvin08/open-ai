import React from 'react'
import ClientAccount from '@/components/ClientAccount';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const PortfolioPage = () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientAccount />
    </HydrationBoundary>
  )
}

export default PortfolioPage
