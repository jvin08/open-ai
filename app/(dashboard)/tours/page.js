import { 
    dehydrate, 
    HydrationBoundary, 
    QueryClient 
} from '@tanstack/react-query';
import ToursPage from "@/components/ToursPage";
import { getAllTours } from '@/utils/actions';

const AllToursPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['tours', ''], // '' - default value for the searchTerm
    queryFn: () => getAllTours(),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ToursPage />
    </HydrationBoundary>
  )
}

export default AllToursPage
