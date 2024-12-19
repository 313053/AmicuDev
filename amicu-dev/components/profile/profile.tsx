'use client'

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { User } from "lucide-react"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"


export default function ProfileCard() {
    
    const { user, isLoaded } = useUser()
    
    const registrationDate = user?.createdAt? 
        new Date(user.createdAt).toLocaleDateString() 
        : 
        "Unknown registration date";


    if (!isLoaded){
        return(
            <div className="flex flex-col items-center w-[640px] h-[450px] border rounded-xl bg-card pt-6">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-6 my-6 w-full flex flex-col items-center">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-[150px] w-3/4" />
                </div>
            </div>
        )
    }

    return(
        <Card className="sm:w-[640px] flex flex-col items-center">
            <CardHeader className="flex flex-col items-center border-b w-3/4 pb-4 mb-4">
                <Avatar className="border-2 border-subtext h-14 w-14">
                    <AvatarImage src={user?.imageUrl} alt={user?.username || "User"} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.username}</CardTitle>
                <CardDescription>{user?.primaryEmailAddress?.emailAddress}</CardDescription>
                <Button type="button" variant="default">Edit Profile</Button>  
            </CardHeader>
            <CardContent className="w-3/4 flex flex-col items-center space-y-6">
                <div className="flex flex-row justify-center w-full space-x-4">
                    <div className="flex flex-col items-center w-1/2">
                        <span className="w-full h-full text-center font-semibold">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                        <span className="w-full h-full text-center font-semibold">User since {registrationDate}</span>
                    </div>
                </div>
                <div className="w-full border rounded-xl p-4">
                <p className="font-bold pb-2">About</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </CardContent>
        </Card>

    )
}