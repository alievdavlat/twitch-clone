import  * as  React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Fullscreen, KeyRound, MessageSquare, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import NavItem, { NavItemSkeleton } from './NavItem'

const Navigation = () => {
  const pathname = usePathname()
  const {user} = useUser()
  const routes = [
    {
      id:1,
      label:"Stream",
      href:`/u/${user?.username}`,
      icon:Fullscreen
    },
    {
      id:2,
      label:"Keys",
      href:`/u/${user?.username}/keys`,
      icon:KeyRound
    },    

    {
      id:3,
      label:"Chat",
      href:`/u/${user?.username}/chat`,
      icon:MessageSquare
    },
    {
      id:4,
      label:"Community",
      href:`/u/${user?.username}/community`,
      icon:Users
    },
  ]

  if (!user?.username) {
      return (
        <ul className='space-y-2'>
            {
              [...Array(4)].map((_, i) => (
                <NavItemSkeleton key={i} />
              ))
            }
        </ul>
      )
  }

  return (
   <ul className='space-y-2 px-2 pt-4 lg:pt-0'>
{
  routes.map((route) => (
      <NavItem
      key={route.id}
      route={route}
      isActive={pathname === route.href}
      />
  ))
}     
   </ul>
  )
}

export default Navigation