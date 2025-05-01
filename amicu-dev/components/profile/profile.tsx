'use client'

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { User } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { useEffect, useState } from "react"
import UserBio from "./bio"
import { UserData, UserLink } from "@/lib/types/profileTypes"
import UserLinks from "./links"
import UserTags from "./tags"
import { TagData } from "@/lib/types/tagTypes"




export default function ProfileCard({ userId } : {userId : string}) {
    const [ user, setUser ] = useState<UserData | null>(null);
    const [ userTags, setUserTags ] = useState<TagData[] | null>(null);
    const [ isLoadingMain, setIsLoadingMain ] = useState(true);
    const [ isLoadingTags, setIsLoadingTags ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const { user: currentUser, isLoaded: isAuthLoaded } = useUser()

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setError("User ID is required!");
                setIsLoadingMain(false);
                return;
            }
            try {
                setIsLoadingMain(true);
                const response = await fetch(`/api/get-user/${userId}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status}`);
                }

                const data = await response.json();
                const userData: UserData = {
                    id : BigInt(data.id),
                    username: data.clerkData.username,
                    emailAddress: data.clerkData.emailAddresses[0].emailAddress,
                    firstName: data.clerkData.firstName,
                    lastName: data.clerkData.lastName,
                    imageUrl: data.clerkData.imageUrl,
                    createdAt: data.clerkData.createdAt,
                    bio: data.bio ?? "",
                    links: data.links, 
                  }
                setUser(userData);
                setIsLoadingMain(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err instanceof Error ? err.message : "Unknown error occured");
                setIsLoadingMain(false);
            }
        }
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const fetchUserTagData = async () => {
            if (!user) {
                return;
            }
            try {
                setIsLoadingTags(true);
                const response = await fetch(`/api/get-user-tags/${user.id}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch tag data: ${response.status}`)
                }

                const data = await response.json()
                const tagData : TagData[] = data.map((item: TagData) => ({
                    name: item.name,
                    complexity: item.complexity
                }));
                setUserTags(tagData);
                setIsLoadingTags(false);
                console.log(tagData)
            } catch (err) {
                console.error("Error fetching user tag data: ", err);
                setError(err instanceof Error ? err.message : "Unknown error occured");
                setIsLoadingTags(false);
            }
        }
        fetchUserTagData();
    }, [user]);
    
    async function handleBioChange(newbio: string) {
        try {
            const res = await fetch("/api/set-bio",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ bio: newbio}),
            });
            
            if (!res.ok) {
                throw new Error("Failed to update bio");
            }
        }   catch (err) {
            console.error(err);
        }
    }

    async function handleLinksChange(newLinks: UserLink[]) {
        try {
            const res = await fetch("/api/set-links",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ links: newLinks}),
            });
            
            if (!res.ok) {
                throw new Error("Failed to update links");
            }
        }   catch (err) {
            console.error(err);
        }
    }

    const registrationDate = user?.createdAt? 
    new Date(user.createdAt).toLocaleDateString() 
    : 
    "Unknown registration date";

    const isCurrentUser = (isAuthLoaded && currentUser && currentUser.id === userId);
    

    if (isLoadingMain){
        return(
            <Card className="w-full sm:w-[640px] flex flex-col items-center">
                <CardContent className="flex flex-col items-center w-3/4 pt-6">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div className="space-y-6 my-6 w-full flex flex-col items-center">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-[250px] w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error ) {
        return (
            <Card className="sm:w-[640px] flex flex-col items-center p-6">
                <div className="text-center font-bold">
                    <p>Error loading user profile</p>
                    <p className="text-sm">{error}</p>
                </div>
            </Card>
        )
    }

    return(
        <Card className="w-full sm:w-[520px] md:w-[680px] h-full flex flex-col items-center pb-10">
            <CardHeader className="flex flex-col md:flex-row items-center md:justify-evenly border-b w-3/4 pb-4 mb-4">
                <Avatar className="border-2 border-subtext h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28">
                    <AvatarImage src={user?.imageUrl} alt={user?.username || "User"} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center md:items-start">
                    <CardTitle className="text-xl font-bold uppercase">{user?.username}</CardTitle>
                    <CardDescription className="italic">{user?.emailAddress}</CardDescription> 
                    <UserLinks
                        content={user?.links || null}
                        editable={isCurrentUser || false}
                        onSave={handleLinksChange}    
                    />
                </div>
            </CardHeader>
            <CardContent className="w-full sm:w-5/6 md:w-3/4 h-auto flex flex-col items-center space-y-5">
                <div className="flex flex-row items-center justify-evenly w-full space-x-4">
                    <div className="flex flex-col items-center w-1/2">
                        <span className="w-full h-full text-center font-semibold">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                        <span className="w-full h-full text-center font-semibold">User since {registrationDate}</span>
                    </div>
                </div>
                <UserBio
                    content={user?.bio || ""}
                    editable={isCurrentUser || false}
                    onSave={handleBioChange}
                />
                <div className="h-2"></div>
                <p className="text-xl sm:text-2xl font-semibold w-full text-left">Skills</p>
                <UserTags 
                    content={userTags || []}
                    editable={isCurrentUser || false}
                    onSave={console.log("tags saved")}    
                />
            </CardContent>
        </Card>

    )
}