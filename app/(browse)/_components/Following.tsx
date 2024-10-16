import { useSidebar } from "@/store/useSidebar";
import { UserProp } from "@/types";
import UserItem, { UserItemSkeleton } from "./UserItem";

interface FollowingProps {
  data: UserProp[];
}

const Following = ({ data }: FollowingProps) => {
  const { collapsed } = useSidebar((state) => state);

  if (data.length === 0) {
    return null;
  }

  return (
    <div>
      {!collapsed && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground px-1">
            Following
          </p>
        </div>
      )}

<ul className="space-y-2 px-2">
        {
         data?.length > 0 && data.map((user) => (
             <UserItem key={user._id}  user={user} isLive={user.stream?.isLive} />
          ))
        }
      </ul>
    </div>

    
  );
};

export default Following;


export const FollowingSkeleton = () => {
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