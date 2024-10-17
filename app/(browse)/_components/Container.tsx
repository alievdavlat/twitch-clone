"use client"
import { cn } from '../../../lib/utils'
import { useSidebar } from '../../../store/useSidebar'
import { childProps } from '../../../types'
import { useMediaQuery } from 'usehooks-ts'
import React, { useEffect } from 'react'

const Container = ({children}:childProps) => {
  const matches = useMediaQuery('(max-width: 1024px)')

  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state)

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