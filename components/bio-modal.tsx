"use client";
import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface BioModalProps {
  initialValue?: string;
  username:string
}
const BioModal = ({ initialValue , username}: BioModalProps) => {
  const closeRef = React.useRef<React.ElementRef<"button">>(null);
  const [value, setValue] = React.useState(initialValue);
  const [isPending, startTranstion] = React.useTransition()
  const updateUser = useMutation(api.users.updateUser)
  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTranstion(() => {
        updateUser(
          {
            bio:value,
            username
          }
        )
        toast.success("user info updated successfully")
        closeRef?.current?.click();
    })
}
  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => [
    setValue(e.target.value)
  ]

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="ml-auto" variant={"ghost"} size={"sm"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user bio</DialogTitle>
        </DialogHeader>

        <form
        onSubmit={onSubmit}
        className="space-y-4"
        >
          <Textarea
          placeholder="User bio"
          value={value}
          className="border-neutral-600 focus:outline-none shadow-none border-[0.5px]"
          onChange={onChange}
          />
          <div className="flex justify-between">
          <DialogClose asChild  ref={closeRef}>
              <Button type="button" variant={'ghost'}>
                Cancel
              </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            type="submit"
            variant={'primary'}
          >
            Save
          </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BioModal;
