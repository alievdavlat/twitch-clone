import * as React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCheckIcon, Copy } from 'lucide-react'
interface CopyButtonProps { 
  value?: string | null | undefined
}

const CopyButton = ({value}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = React.useState(false)
  
  const onCopy = () => {
    if(!value) return ;

    setIsCopied(true)
    navigator.clipboard.writeText(value)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const Icon = isCopied ? CheckCheckIcon : Copy
  
  return (
    <Button
    onClick={onCopy}
    variant={'ghost'}
    
    size={'sm'}
    className='z-[99999]'
    >
      <Icon
      className='h-4 w-4'
      />
    </Button>
  )
}

export default CopyButton