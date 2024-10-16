"use client";
import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { IngressInput } from "livekit-server-sdk";
import { createIngress } from "@/actions/ingress";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const RTMP = String(IngressInput.RTMP_INPUT);
const WHIP = String(IngressInput.WHIP_INPUT);

type IngressType = typeof RTMP | typeof WHIP;
interface ConnectModalProps {
  username:string
}
const ConnectModal = ({username}: ConnectModalProps) => {
  const closeRef = React.useRef<React.ElementRef<"button">>(null);
  const [isPending, startTransition] = React.useTransition();
  const [ingressType, setIngressType] = React.useState<IngressType>(RTMP);
  const user = useQuery(api.users.getUsersByUsername, {username:username});

  
  
  const onSubmit = async () => {
    startTransition(async () => {
      try {
     if (user !== undefined) {
      const response = await createIngress(parseInt(ingressType), user);
      if (response.ingress && response.ingressId && response.serverUrl && response.streamKey) { 
        toast.success("Ingress created successfully!");
        console.log("Stream URL:", response.serverUrl);
        console.log("Stream Key:", response.streamKey);
      } else {
        
      }
      closeRef?.current?.click();
     }
      } catch (err) {
        toast.error("Something went wrong");
        console.log(err, 'err'); 
      }
    });
  };
  
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Generate connection</Button>
      </DialogTrigger>
      <DialogContent className="border-neutral-600 border-opacity-[0.7]">
        <DialogHeader>
          <DialogTitle>Generate connection</DialogTitle>
        </DialogHeader>

        <Select
          value={ingressType}
          disabled={isPending}
          onValueChange={(value) => setIngressType(value)}
        >
          <SelectTrigger className="w-full ">
            <SelectValue placeholder="Ingress Type" />
          </SelectTrigger>
          <SelectContent className="border-[0.6px] border-opacity-[0.5]">
            <SelectItem value={RTMP}>RTMP</SelectItem>
            <SelectItem value={WHIP}>WHIP</SelectItem>
          </SelectContent>
        </Select>

        <Alert className="border-neutral-600 border-opacity-[0.5]">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This action reset all active streams using the current connection
          </AlertDescription>
        </Alert>

        <div className="flex justify-between">
          <DialogClose ref={closeRef} asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} variant={"primary"} disabled={isPending}>
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;
