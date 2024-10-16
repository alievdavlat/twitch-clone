
import { childProps } from '@/types'
import React, { Suspense } from 'react'
import Navbar from './_components/Navbar'
import Sidebar, { SidebarSkeleton } from './_components/Sidebar'
import Container from './_components/Container'

const BrowseLayout = ({children}:childProps) => {
  return (
    <>
    <Navbar/>
    <div className='flex h-full pt-20'>
      <Suspense fallback={<SidebarSkeleton/>}>
      <Sidebar/>
      </Suspense>

      <Container >
      {children}
      </Container>
    </div>
    </>
  )
}

export default BrowseLayout