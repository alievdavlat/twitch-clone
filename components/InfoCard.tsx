"use client"
import { useAuth } from '@clerk/clerk-react';
import { Pencil } from 'lucide-react';
import React from 'react'
import { Separator } from './ui/separator';
import Image from 'next/image';
import InfoModal from './InfoModal';

interface InfoCardProps {
  viewerIdentity:string
  hostIdentity:string
  name: string;
  thumbnailUrl: string;
}

const InfoCard = ({hostIdentity, name, thumbnailUrl}:InfoCardProps) => {
  const {userId} = useAuth()
  const isHost = hostIdentity === userId;

  if (!isHost) {
    return null
  }

    return (
    <div className='px-4'>
        <div className='rounded-xl bg-background'>
              <div className='flex items-center gap-x-2.5'>
                <div className='rounded-md bg-blue-600 p-2 h-auto w-auto'>
                  <Pencil className='h-5 w-5'/>
                </div>
                <div>
                  <h2 className='text-sm lg:text-lg font-semibold capitalize'>
                    Edit your stream info
                  </h2>
                  <p className='text-neutral-400 text-xs lg:text-sm'>
                    Maximize your visibility
                  </p>
                </div>
                {/* modal btn */}
                <InfoModal
                  initialName={name}
                  initialThumbnail={thumbnailUrl}
                  hostIdentity={hostIdentity}
                />
              </div>
              <Separator className='bg-neutral-400 my-1'/>
              <div className='p-4 lg:p-6 space-y-4'>
                  <div>
                    <h3 className='text-sm text-neutral-400 mb-2'>
                      Name
                    </h3>
                    <p className='text-sm font-semibold'>
                    {name}
                    </p>
                  </div>
                  <div>
                  <h3 className='text-sm text-neutral-400 mb-2'>
                      Thumbnail
                    </h3>
                    {thumbnailUrl && (
                      <div className='realtive aspect-video rounded-md overflow-hidden w-[200px] border border-white/10'>
                          <Image
                            fill
                            src={thumbnailUrl}
                            alt={name}
                          />
                      </div>
                    )}
                  </div>
              </div>
        </div>
    </div>
  )
}

export default InfoCard