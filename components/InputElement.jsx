import React from 'react'

const InputElement = (props) => {
  const handleInput = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      props.setQuantity(value);
    }
  }
  return (
    <span className='flex items-center justify-between mb-2'>
      <p className='pt-2 pb-4 pr-4 italic text-sm'>{props.name} </p> 
      <input type="number"
            placeholder={props.placeholder} 
            className="input" 
            pattern={props.pattern} 
            onChange={handleInput}
            value={props.quantity}
            required
      />
    </span>
  )
}

export default InputElement
