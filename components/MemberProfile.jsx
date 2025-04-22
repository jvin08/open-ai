import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const MemberProfile = async () => {
  const user = await currentUser()
  return (
    <div className='px-4 flex items-center gap-4'>
    <UserButton />
    <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  )
}

export default MemberProfile
