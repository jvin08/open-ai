import React from 'react'

const UserTokens = ({tokens}) => {
  return (
    <div className='mt-4 px-4'>
      <button className="btn w-full flex">
        <span className='mr-auto'>Tokens </span>
        <span className="badge badge-sm badge-secondary">+{tokens}</span>
      </button>
    </div>
  )
}

export default UserTokens;
