import { useState, Fragment } from 'react';
import { createNewAsset, deleteAssets, getAllPortfolios, createNewPortfolio } from '@/utils/actions';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { FaPlus } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";

const HandleAsset = ({ asset, ref, toggleModal, clearInput, type }) => {
  const { userId } = useAuth();
  const [portfolioName, setPortfolioName] = useState("")
  const [newPortfolioName, setNewPortfolioName] = useState("")
  const [showInput, setShowInput] = useState(false)
  const queryClient = useQueryClient();
  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: getAllPortfolios,
  });
  const addPortfolio = useMutation({
    mutationFn: async (name) => {
      const addedPortfolio = createNewPortfolio(name)
      queryClient.invalidateQueries({ queryKey: ['portfolios']});
      return addedPortfolio
    },
    onSuccess: (data) => {
      if(!data){
        toast.error("Something went wrong");
        return
      }
      return data;
    }
  })
  const { mutate, isPending } = useMutation({
    mutationFn: async (assetData) => {
      if(type === "buy"){
        return createNewAsset(assetData, type);
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
      assetQuantity: 1,
      portfolioName: portfolioName,
      assetSymbol: asset.symbol,
      assetType: asset.assetType,
      lastPrice: asset.close,
      updatedAt: new Date()
    })
    toggleModal(false);
    clearInput()
  }
  const closeToggle = () => {
    toggleModal(false)
    ref.current.close()
    clearInput()
  }
  const handleInput = async () => {
    console.log("handleInput")
    if(showInput){
      newPortfolioName && addPortfolio.mutate(newPortfolioName)
      setNewPortfolioName("")
    }
    setShowInput(input => !input);
  }
  const handleChange = (e) => {
    const { value } = e.target
    setNewPortfolioName(value)
  }
  return (
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <div className='flex items-center justify-between'>
            {showInput 
              ? <input 
                  className="input my-2.5" 
                  type="input input-accent" 
                  onDragLeave={()=>setShowInput(false)} 
                  placeholder='Enter new portfolio name:'
                  value={newPortfolioName}
                  onChange={handleChange}
              /> 
              : <h3 className="font-bold text-lg py-4">Trade confirmation</h3>
            }
            <div className="tooltip tooltip-closed tooltip-bottom" data-tip={!showInput ? "New portfolio" : newPortfolioName ? `Add new name` : "Go back"}>
              <button type="button" className='btn btn-ghost ml-2' onClick={handleInput}>
                {!showInput ? <FaPlus/> : newPortfolioName ? "add" : <RiArrowGoBackFill />}
              </button>
            </div>
          </div>
          {!showInput ? <Fragment>
            <p className='py-2'>{asset?.name} ({ asset?.symbol })</p>
            <p className="py-2">Price: { asset?.currency } { asset?.close }</p>
            <p className='pt-2 pb-4'>Quantity: 1</p>
            <label className="select">
              <span className="label">Portfolio</span>
              <select 
                value={portfolioName}
                onChange={(e)=>setPortfolioName(e.target.value)} 
                required
              >
                <option disabled value="">type</option>
                {portfolios?.length > 0 && portfolios.map(portfolio=><option key={portfolio.name}>{portfolio.name}</option>)}
              </select>
            </label>
            <div className="modal-action">
              <form method="dialog" className='flex' onSubmit={handleAsset}>
                <button type="submit" className="btn">{type}</button>
                <button type="button" className="btn ml-2" onClick={closeToggle}>Decline</button>
              </form>
            </div>
          </Fragment> : <div className="h-[218px]" /> }
        </div>
      </dialog>
    
  )
}

export default HandleAsset
