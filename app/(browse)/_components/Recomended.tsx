"use client"
import { useSidebar } from "@/store/useSidebar";
import { UserProp } from "@/types";
import UserItem, { UserItemSkeleton } from "./UserItem";

interface RecomendedProps {
  data: UserProp[];
}

const Recomended = ({ data }: RecomendedProps) => {

  const {collapsed} = useSidebar((state) => state)
  
  const showLabel = !collapsed  && data !== undefined


  return (
    <div>
      {
        showLabel && (
          <div className="pl-6 mb-4">
              <p className="text-sm text-muted-foreground px-1">
              Recomended
              </p>
          </div>
        )
      }
      <ul className="space-y-2 px-2">
        {
         data?.length > 0 && data.map((user) => (
             <UserItem key={user._id}  user={user} isLive={user.stream?.isLive} />

          ))
        }
      </ul>
    </div>
  )
};

export default Recomended;


export const RecomendedSkeleton = () => {
  return (
    <ul className="px-2">
        {
          [...Array(3)].map((_, i) => (
            <UserItemSkeleton key={i} />
          ))
        }
    </ul>
  )
}