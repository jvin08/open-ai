import TourInfo from '@/components/TourInfo';
import { generateUnspashTourImage, getSingleTour } from '@/utils/actions';
import { redirect } from 'next/navigation';
import Link from "next/link"
import Image from 'next/image';
import Loading from '../loading';

const SingleTourPage = async ({ params }) => {
  const { id } = await params;
  const tour = await getSingleTour(id)
  if(!tour || tour.length === 0) {
    redirect("/tours");
  }
  const tourImage = await generateUnspashTourImage({ city:tour[0].city, country:tour[0].country })
  return (
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        Back to tours
      </Link>
      {
        tourImage ? <div>
          <Image 
            src={tourImage}
            width={300}
            height={300}
            className="rounded-xl shadow-xl mb-18 h-96 w-96 object-cover"
            alt={tour.title || "tour title"}
            priority
          />
        </div> : null
      }
      <TourInfo tour={tour[0]} />
    </div>
  )
}

export default SingleTourPage
