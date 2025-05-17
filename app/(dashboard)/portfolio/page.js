import React from 'react'
import Portfolio from '@/components/Portfolio';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const PortfolioPage = () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Portfolio />
    </HydrationBoundary>
  )
}

export default PortfolioPage
