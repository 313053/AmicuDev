'use client';

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";


export default function UserAvatar(){
    const { user } = useUser();
    return (
        <Avatar>
            <AvatarImage src={user?.imageUrl} alt={user?.username || "User"} />
            <AvatarFallback>
                <User />
            </AvatarFallback>
        </Avatar>
    );
}