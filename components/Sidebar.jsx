import React from 'react'
import SidebarHeader from './SidebarHeader'
import NavLinks from './NavLinks'
import MemberProfile from './MemberProfile'

const Sidebar = () => {
  return (
    <div className='px-4 w-72 min-h-full bg-base-300 py-12 flex flex-col gap-8'>
      {/* first row */}
      <SidebarHeader />
      {/* second row */}
      <NavLinks />
      {/* third row */}
      <MemberProfile />
    </div>
  )
}

export default Sidebar
