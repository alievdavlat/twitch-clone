'use client'
import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import Toggle, { ToggleSkeleton } from './Toggle'
import Recomended, { RecomendedSkeleton } from './Recomended'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import Following, { FollowingSkeleton } from './Following'

const Sidebar = () => {
  const { user, isSignedIn } = useUser()
  const [data, setData] = React.useState<any[]>([])
  const [followedUsers, setFolloedUsers] = React.useState<any>([])
  const recomended = useQuery(api.users.getUsers, {id:user?.id})
  //@ts-ignore
  const followers = useQuery(api.followers.getFollowedUsers, {id:user?.id})
  
        
  useEffect(() => {
    if (recomended) {
      setData(recomended)
    }
    if (followers) {
      setFolloedUsers(followers)
    }

  }, [recomended])
  return (
   <>
    {
      recomended && followers && isSignedIn ?  <Wrapper>
      <Toggle/>
      <div className='space-y-4 pt-4 lg:pt-0'>
       {
         data.length === 0  ? <h3 className='text-center'>No recomended</h3> :
         <Recomended data={data} />
       }
       {
         followedUsers.length === 0 ?  <h3 className='text-center'>No followers</h3> :
         <Following data={followedUsers}/>
       }
      </div>
    </Wrapper> : <SidebarSkeleton/>
    }
   </>
  )
}

export default Sidebar


export const SidebarSkeleton = () => {

  return (
    <aside className='fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50'>
      <ToggleSkeleton/>
      <RecomendedSkeleton/>
      <br />
      <FollowingSkeleton/>
    </aside>
  )
}