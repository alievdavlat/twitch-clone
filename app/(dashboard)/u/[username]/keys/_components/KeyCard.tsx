import * as React from 'react'
import { Input } from '@/components/ui/input'
import CopyButton from './CopyButton'
import { Button } from '@/components/ui/button'

interface KeyCardProps {
  value?: string | undefined | null
}

const KeyCard = ({value}: KeyCardProps) => {
  const [show, setShow] = React.useState(false)
  return (
    <div className='rounded-xl bg-muted p-6'>
          <div className='flex items-start gap-x-10'>
              <p className='font-semibold shrink-0'>
                Stream Key
              </p>

              <div className='space-y-2 w-full'>
                  <div className='w-full flex items-center gap-x-2'>
                    <Input
                    value={value || ''}
                    type={show ? 'text' : 'password'}
                    disabled
                    placeholder='Stream Key'
                    className='border-[0px]'
                    />
                    <CopyButton
                    value={value || ''}
                    />
                  </div>

                  <Button
                  size={'sm'}
                  variant={'link'}
                  onClick={() => setShow(!show)}
                  >
                      {
                        show ? "Hide" : 'Show'
                      }
                  </Button>
              </div>
          </div>
    </div>
  )
}

export default KeyCard