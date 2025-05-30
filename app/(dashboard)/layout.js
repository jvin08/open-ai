import React from 'react'
import Sidebar from '@/components/Sidebar'
import { FaBarsStaggered } from 'react-icons/fa6';

const layout = ({children}) => {
  return (
    <div className='drawer lg:drawer-open'>
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden fixed top-6 right-6">
          <FaBarsStaggered className='w-8 h-8' />
        </label>
        <div className="navbar bg-base-200 px-2 sm:px-4 py-12 min-h-screen">
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  )
}

export default layout
