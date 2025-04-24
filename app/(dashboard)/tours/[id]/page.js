import TourInfo from '@/components/TourInfo';
import { getSingleTour } from '@/utils/actions';
import { redirect } from 'next/navigation';
import Link from "next/link"

const SingleTourPage = async ({ params }) => {
  const { id } = await params;
  const tour = await getSingleTour(id)
  if(!tour || tour.length === 0) {
    redirect("/tours");
  }
  return (
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        Back to tours
      </Link>
      <TourInfo tour={tour[0]} />
    </div>
  )
}

export default SingleTourPage
