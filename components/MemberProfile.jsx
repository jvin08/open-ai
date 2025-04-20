import { UserButton } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'
import React from 'react'

const MemberProfile = async () => {
  const user = await currentUser()
  // const { userId } = await auth()
  return (
    <div className='px-4 flex items-center gap-4'>
    <UserButton />
    <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  )
}

export default MemberProfile
