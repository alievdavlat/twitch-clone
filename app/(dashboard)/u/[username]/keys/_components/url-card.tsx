import { Input } from '@/components/ui/input'
import React from 'react'
import CopyButton from './CopyButton'

interface UrlCardProps {
  value:string | null | undefined
}

const UrlCard = ({value}:UrlCardProps) => {

  return (
    <div className='roounded-xl bg-muted p-6'>
        <div className='flex items-center gap-x-10'>
            <p className='font-semibold shrink-0'>
                Server URL
            </p>
            <div className='space-y-2 w-full'>
                <div className='w-full flex items-center gap-x-2'>
                    <Input
                    value={value || ''}
                    disabled
                    placeholder='Server URL'
                    className='border-[0px]'
                    />
                    <CopyButton value={value || ''}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UrlCard