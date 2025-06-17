import React from 'react'

const InputPrice = (props) => {
  const handleInput = (e) => {
    const value = e.target.value;
    if (/^\d*(\.\d{0,5})?$/.test(value)) {
      props.setPrice(value);
    }
  }
  return (
    <span className='flex items-center justify-between mb-2'>
      <p className='pt-2 pb-4 pr-4 italic text-sm'>{props.text} </p> 
      <input type={props.type}
            placeholder="Adjust price (e.g. 31.0001)"
            className="input" 
            pattern="^\d*(\.\d{0,5})?$" 
            onChange={handleInput}
            value={props.value}
            min={0}
            required
      />
    </span>
  )
}

export default InputPrice
