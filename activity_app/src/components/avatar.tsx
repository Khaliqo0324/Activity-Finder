import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
   
  export function UserAvatar() {
    return (
      <Avatar>
        <AvatarImage src="https://www.flaticon.com/free-icons/user" alt="@shadcn" />
        <AvatarFallback>USR</AvatarFallback>
      </Avatar>
    )
}