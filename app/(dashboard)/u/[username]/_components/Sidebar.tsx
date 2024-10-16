
import React from 'react'
import CreatorSidebarWrapper from './Wrapper'
import Toggle from './Toggle'
import Navigation from './Navigation'

const Sidebar = () => {
  return (
    <CreatorSidebarWrapper>
      <Toggle/>
      <Navigation/>
    </CreatorSidebarWrapper>
  )
}

export default Sidebar