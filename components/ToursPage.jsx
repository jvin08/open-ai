'use client';
import { useState } from "react";
import { getAllTours } from '@/utils/actions';
import { useQuery } from '@tanstack/react-query';
import ToursList from './ToursList';

const ToursPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ['tours', searchTerm],
    queryFn: () => getAllTours(searchTerm),
  })
  return (
    <div className="mt-8 mb-auto">
      <form className="max-w-full mb-12">
        <div className="join w-full">
          <input 
            type="text" 
            placeholder="enter city or country here..." 
            className="input input-bordered join-item w-full"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            required
          />
          <button 
            className="btn btn-primary join-item uppercase" 
            type="button" 
            disabled={isPending}
            onClick={() => setSearchTerm("")} 
          >
            {isPending ? "please wait..." : "reset"}
          </button>
        </div>
      </form>
      {isPending ? <span className='loading'></span> : <ToursList data={data} />}
    </div>
  )
}

export default ToursPage;