"use client"
import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { childProps } from '@/types'
import { useMediaQuery } from 'usehooks-ts'
import { useCratorSidebar } from '@/store/use-creator-sidebar'

const Container = ({children}:childProps) => {
  const matches = useMediaQuery('(max-width: 1024px)')

  const { collapsed, onCollapse, onExpand } = useCratorSidebar((state) => state)

  useEffect(() => {
    if (matches) {
        onCollapse()
    } else {
        onExpand()
    }
  }, [matches, onCollapse, onExpand])

  return (
    <div 
    className={cn('flex-1', collapsed ? 'ml-[70px]' : 'ml-[70px] lg:ml-60')}
    >
      {children}
    </div>
  )
}

export default Container