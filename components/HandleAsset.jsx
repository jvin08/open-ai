import { useState } from 'react';
import { createNewAsset, deleteAssets } from '@/utils/actions';
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

const HandleAsset = ({ asset, ref, toggleModal, quantity, clearInput, type }) => {
  const { userId } = useAuth();
  const [portfolioName, setPortfolioName] = useState("")
  
   const { mutate, isPending } = useMutation({
      mutationFn: async (assetData) => {
        if(type === "buy"){
          return createNewAsset(assetData);
        }
        return deleteAssets(assetData)
      },
      onSuccess: (data) => {
        if(!data){
          toast.error('Something went wrong!');
          return
        }
        return data;
      }
    });
  const handleAsset = (e) => {
    e.preventDefault();    
    mutate({
      clerkId: userId,
      assetName: asset.name,
      assetPrice: asset.close,
      assetQuantity: quantity,
      portfolioName: portfolioName,
      assetSymbol: asset.symbol,
      assetType: asset.assetType
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
            <select 
              value={portfolioName}
              onChange={(e)=>setPortfolioName(e.target.value)} 
              required
            >
              <option disabled value="">portfolio type</option>
              <option>Personal</option>
              <option>Business</option>
              <option>Portfolio 2025</option>
            </select>
          </label>
          <div className="modal-action">
            <form method="dialog" className='flex' onSubmit={handleAsset}>
              <button type="submit" className="btn">{type}</button>
              <button type="button" className="btn ml-2 mr-auto" onClick={closeToggle}>Decline</button>
            </form>
          </div>
        </div>
      </dialog>
    
  )
}

export default HandleAsset
