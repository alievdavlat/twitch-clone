"use client"
import * as React from 'react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Label } from './ui/label'
import { UploadDropzone } from '@/lib/uploadthing'
import { useRouter } from 'next/navigation'
import Hint from './hint'
import { Trash } from 'lucide-react'
import Image from 'next/image'

interface InfoModalProps {
  initialName:string
  initialThumbnail:string
  hostIdentity:string
}

const InfoModal = ({initialName, initialThumbnail, hostIdentity}:InfoModalProps) => {
  const router = useRouter()
  const [name, setName] = React.useState(initialName)
  const [thumbnailUrl, setThumbnailUrl] = React.useState(initialThumbnail)
  const [isUploading , setIsUploading] = React.useState(false) 
  const closeRef = React.useRef<React.ElementRef<"button">>(null);
  const [isPending,startTranstion] = React.useTransition()
  const updateStream = useMutation(api.stream.updateStreamByUserId)

  const onRemove = () => {
    startTranstion(() => {
      updateStream(
        {
          userId:hostIdentity,
          thumbnailUrl:undefined
        }
      )
      setThumbnailUrl('')
      toast.success("Stream info updated successfully")
    })
  }
  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      startTranstion(() => {
          updateStream(
            {
              name,
              userId:hostIdentity
            }
          )
          toast.success("Stream info updated successfully")
          closeRef?.current?.click();
      })
  }
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => [
    setName(e.target.value)
  ]
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={'link'} size={'sm'} className='ml-auto'>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
        <DialogTitle>
          Edit Stream info
        </DialogTitle>
        </DialogHeader>
        <form className='space-y-14' onSubmit={onSubmit}>
          <div className='space-y-2'>
            <Label>
              Name
            </Label>
            <Input
            placeholder='Stream name'
            onChange={onChange}
            value={name}
            disabled={false}
            />
          </div>

          {/* thumb uploader */}

          <div className='space-y-2'>
          <Label>
              Thumbnail
          </Label>
        {
          thumbnailUrl ? (
            <div className='relative aspect-video rounded-xl overflow-hidden border border-white/10'>
                <div className='absolute top-2 right-2 z-[10]'>
                  <Hint label='Remove Thumbnail' asChild side='left'>
                  <Button
                  type='button'
                  disabled={isPending}
                  onClick={onRemove}
                  className='h-auto w-auto p-1.5'
                  >
                    <Trash
                    className='h-4 w-4'
                    />
                  </Button>
                  </Hint>
                </div>
                <Image
                alt='thumbnail'
                src={thumbnailUrl}
                fill
                />
            </div>
          )
          : (
            <div className='rounded-xl border outline-dashed outline-muted'>
            <UploadDropzone
              endpoint='thumbnailUploader'
              appearance={{
                label:{
                  color:'#fff'
                },
                allowedContent:{
                  color:"#fff"
                }
              }}
    
              onClientUploadComplete={ (res) => {
                setIsUploading(true)
                setThumbnailUrl(res?.[0]?.url)
                updateStream({
                  userId:hostIdentity,
                  thumbnailUrl:res?.[0]?.url
                })
                closeRef?.current?.click()
                router.refresh()
              }}
              onUploadError={(error: Error) => {
                toast.error(`ERROR! ${error.message}`);
              }}
            />

            </div>
          )
        }
         
          </div>

          <div className='flex justify-between'>
          <DialogClose asChild ref={closeRef}>
              <Button type='button' variant={'ghost'} disabled={isPending || isUploading}>
                Cancel
              </Button>
          </DialogClose>
          <Button
            variant={'primary'}
            type='submit'
            disabled={isPending || isUploading}

          >
              Save
          </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default InfoModal