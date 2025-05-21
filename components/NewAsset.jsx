import { useState } from 'react';
import { createNewAsset } from '@/utils/actions';
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

const NewAsset = ({ asset, ref, toggleModal, quantity, clearInput }) => {
  const { userId } = useAuth();
  const [portfolioName, setPortfolioName] = useState("Personal")
   const { mutate, isPending } = useMutation({
      mutationFn: async (assetData) => {
        return createNewAsset(assetData);
      },
      onSuccess: (data) => {
        if(!data){
          toast.error('Something went wrong!');
          return
        }
        return data;
      }
    });
  const handleAsset = () => {
    mutate({
      clerkId: userId,
      assetName: asset.name,
      assetPrice: asset.close,
      assetQuantity: quantity,
      portfolioName: portfolioName,
      assetSymbol: asset.symbol
    })
    toggleModal(false);
    clearInput()
  }
  const closeToggle = () => {
    toggleModal(false)
    ref.current.close()
    clearInput()
  }
  return (
    
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <h3 className="font-bold text-lg py-4">Confirm you adding to your portfolio!</h3>
          <p className='py-2'>{asset?.name} ({ asset?.symbol })</p>
          <p className="py-2">Price: { asset?.currency } { asset?.close }</p>
          <p className='pt-2 pb-4'>Quantity: { quantity }</p>
          <label className="select">
            <span className="label">Portfolio</span>
            <select onChange={(e)=>setPortfolioName(e.target.value)}>
              <option>Personal</option>
              <option>Business</option>
              <option>Portfolio 2025</option>
            </select>
          </label>
          <div className="modal-action">
            <form method="dialog" className='flex'>
              <button type="button" className="btn" onClick={handleAsset}>Confirm</button>
              <button type="button" className="btn ml-2 mr-auto" onClick={closeToggle}>Decline</button>
            </form>
          </div>
        </div>
      </dialog>
    
  )
}

export default NewAsset
