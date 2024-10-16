"use client"
import * as React from 'react'
import { redirect } from 'next/navigation'
import Results, { ResultsSkeleton } from './_components/Results'

interface SearchPageProps {
  searchParams: {
    term?: string
  }
}

const SearchPage = ({searchParams}: SearchPageProps) => {
  if (!searchParams?.term) {
    return (
      redirect('/')
    )
  }
  

  

  return (
    <div className='h-full p-8 max-w-screen-2xl mx-auto'>
       <React.Suspense fallback={<ResultsSkeleton/>}>
       <Results term={searchParams?.term}/>
       </React.Suspense>
    </div>
  )
}

export default SearchPage