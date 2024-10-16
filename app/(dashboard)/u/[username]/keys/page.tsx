"use client"
import * as React from 'react'
import UrlCard from './_components/url-card'
import { useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import KeyCard from './_components/KeyCard'
import ConnectModal from './_components/ConnectModal'
interface KeysPageProps {
  params:{username:string}
}
const KeysPage = ({params}: KeysPageProps) => {

  const {user} = useUser()
    //@ts-ignore
    const stream = useQuery(api.stream.getStreamByUserId, { userId: user?.id });


  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>
          Keys & URLs
        </h1>
        <ConnectModal username={params.username}/>
      </div>

      <div className='space-y-4'>
        <UrlCard value={stream?.serverUrl}/>
        <KeyCard value={stream?.streamKey}/>
      </div>

    </div>
  )
}

export default KeysPage