"use client"
import { cn } from '@/lib/utils'
import { useCratorSidebar } from '@/store/use-creator-sidebar'
import React from 'react'

interface CreatorSidebarWrapperProps {
  children:React.ReactNode
} 

const CreatorSidebarWrapper = ({children}:CreatorSidebarWrapperProps) => {  
  const {collapsed} = useCratorSidebar((state) => state)  

  return (
 <aside
    className={cn('fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-50', collapsed && 'w-[70px] transition ease-in')}
    
    >      {children}
    </aside>
  )
}

export default CreatorSidebarWrapper