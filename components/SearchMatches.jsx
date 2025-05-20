import { useState } from 'react';
import { debounce } from 'lodash';
import { useMutation } from '@tanstack/react-query';
import { searchMatchedTickers } from '@/utils/actions';

const SearchMatches = ({ disabled, searchTerm, handleInput }) => {
  const [data, setData] = useState(["VTI","GLD", "VOO", "IBIT", "XRP", "SOL", "BND", "VEU", "VNQ"])
  const { mutate, isPending } = useMutation({
      mutationFn: async (query) => {
        return searchMatchedTickers(query);
      },
      onSuccess: (data) => {
        if(!data){
          toast.error('Something went wrong!');
          return
        }
        setData(data)
      }
    });
  const handleChange = (e) => {
    const { value } = e.target
    handleInput(value)
  };
  const handleClick = (e) => {
    const ticker = e.target.name
    handleInput(ticker);
    document.activeElement.blur()
  }
  return (
    <div className="dropdown dropdown-focus w-full">
      <input 
        tabIndex={0}
        type='text' 
        className='input input-bordered join-item w-full' 
        placeholder='Search for asset (e.g. GLD, APPL)'
        name='asset'
        required  
        title='Please provide asset symbol'
        onChange={handleChange}
        value={searchTerm}
        disabled={disabled}
        autoComplete='off'
      />
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm">
        {data.map((ticker)=><li key={ticker} onClick={handleClick} ><a name={ticker}>{ticker}</a></li>)}
      </ul>
    </div>
  )
}

export default SearchMatches
