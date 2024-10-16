"use client"
import * as React from 'react'
import { childProps } from '@/types'
import { useSidebar } from '@/store/useSidebar'
import { cn } from '@/lib/utils'

const Wrapper = ({children}:childProps) => {
  const {collapsed} = useSidebar((state) => state)
 

  return (
    <aside
    className={cn('fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-50', collapsed && 'w-[70px] transition ease-in')}
    >
      {children}
    </aside>
  )
}

export default Wrapper