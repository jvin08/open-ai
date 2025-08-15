import { fetchOrGenerateTokens } from '@/utils/actions';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import UserTokens from '@/components/UserTokens';

const MemberProfile = async () => {
  const user = await currentUser();
  const tokensTotal = await fetchOrGenerateTokens(user.id)
  return (
    <div>
      <div className='px-4 flex items-center gap-4'>
        <UserButton />
        <p>{user.emailAddresses[0].emailAddress}</p>
      </div>
      <UserTokens tokens={tokensTotal} />
    </div> 
  )
}
export default MemberProfile
