import * as React from "react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/store/useLoading";
import ChatLoading from "./loading";

type FiledTypes = "isChatEnabled" | "isChatFollowersOnly" | "isChatDelayed";

interface ToggleCardProps {
  field: FiledTypes;
  label: string;
  value: any;
}

const ToggleCard = ({ field, label, value }: ToggleCardProps) => {
  const { user } = useUser();
  const updateStream = useMutation(api.stream.updateStreamByUserId);
  const [isPending, startTransition] = React.useTransition();
  const { isLoading , setIsLoading} = useLoading();
  const OnChange = async () => {
    startTransition(() => {
      if (user?.id) {
        updateStream({
          userId: user?.id,
          [field]: !value,
        })
          .then(() => {
            toast.success("Stream updated successfully");
          })
          .catch(() => {
            toast.error("Somthing went wrong");
          });
      }
    });
  };

  React.useEffect(() => {
    setIsLoading(false)
  }, [updateStream,isLoading])
  return (
    <>
      {isLoading  ? <ChatLoading/> : (
        <div className="rounded-xl bg-muted p-6">
          <div className="flex items-center justify-between">
            <p>{label}</p>
            <div className="space-y-2">
              <Switch
                disabled={isPending}
                onCheckedChange={OnChange}
                checked={value}>
                {value ? "On" : "Off"}
              </Switch>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToggleCard;

export const ToggleCardSkeleton = () => {
  return <Skeleton className="rounded-xl p-10 w-full" />;
};
