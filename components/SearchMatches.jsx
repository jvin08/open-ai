import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryTickers } from '@/utils/actions';

const SearchMatches = ({ disabled, searchTerm, handleInput }) => {
  const [data, setData] = useState([])
  const { mutate, isPending } = useMutation({
    mutationFn: async (query) => {
      return queryTickers(query);
    },
    onSuccess: (data) => {
      if(!data){
        toast.error('Something went wrong!');
        return
      }
      console.log(data.results)
      setData(data.results)
    }
  });
  const handleChange = (e) => {
    const { value } = e.target
    mutate(value)
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
        {
          data?.map((ticker)=><li key={ticker.composite_figi} onClick={handleClick} >
            <a name={ticker.ticker}>{ticker.ticker}</a>
          </li>)
        }
      </ul>
    </div>
  )
}

export default SearchMatches
