'use client';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getExistingTour, 
  generateTourResponse, 
  createNewTour, 
  fetchUserTokensById,
  subtractTokens
} from "@/utils/actions";
import TourInfo from "./TourInfo";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const NewTour = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const { mutate, isPending, data: tour } = useMutation({
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);
      if(existingTour) {
        console.log('existing tour: ', existingTour)
        return existingTour;
      }
      const currentTokens = await fetchUserTokensById(userId);
      console.log('current tokens: ', currentTokens)
      if(currentTokens < 500) {
        toast.error("Tokens balance too low...");
        return;
      }
      const newTour = await generateTourResponse(destination);
      if(!newTour){
        toast.error('No matching city found...')
        return null;
      }
      const response = await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ['tours']});
      subtractTokens(userId, newTour.tokens)
      return newTour.tour;
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries())
    mutate(destination);
  };
  if(isPending){
    return <span className="loading loading-lg"></span>
  }
  return (
    <>
      <form 
      onSubmit={handleSubmit} 
      className='max-w-2xl mb-auto'
      >
        <h2 className='mb-4'>Select your dream destination</h2>
        <div className='join w-full'>
          <input 
            type='text' 
            className='input input-bordered join-item w-full' 
            placeholder='city'
            name='city'
            required  
          />
          <input 
            type='text' 
            className='input input-bordered join-item w-full' 
            placeholder='country'
            name='country'
            required  
          />
          <button 
            className='btn btn-primary join-item uppercase' 
            type='submit'
          >
            generate tour
          </button>
        </div>
        <div className='mt-16'>
          { tour ? <TourInfo tour={tour} /> : null }
        </div>
      </form>
      
    </>
  )
}

export default NewTour
