'use client'

import { useClerk, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Settings, User } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { useEffect, useState } from "react"
import UserBio from "./bio"
import { UserData, UserLink } from "@/lib/types/profileTypes"
import UserLinks from "./links"
import { TagData, TagPostProps } from "@/lib/types/tagTypes"
import { useParams } from "next/navigation"
import Tags from "./tags/tags"




export default function ProfileCard() {
    const [ user, setUser ] = useState<UserData | null>(null);
    const [ userTags, setUserTags ] = useState<TagData[] | null>(null);
    const [ isLoadingMain, setIsLoadingMain ] = useState(true);
    const [ isLoadingTags, setIsLoadingTags ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const { user: currentUser, isLoaded: isAuthLoaded } = useUser();
    const { redirectToUserProfile } = useClerk();
    const userId = useParams().id

    
    const isCurrentUser = (isAuthLoaded && currentUser && currentUser.id === userId);


    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setError("User ID is required!");
                setIsLoadingMain(false);
                return;
            }
            try {
                setIsLoadingMain(true);
                const response = await fetch(`/api/user/get-user/${userId}`);

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
                const response = await fetch(`/api/user/get-user/${user.id}/tags`);

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
            const res = await fetch("/api/user/set-bio",{
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
            const res = await fetch("/api/user/set-links",{
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

    async function handleTagsChange({newTags, deletedTags}: TagPostProps) {
        try {
            const res = await fetch("/api/tag/set-user-tags",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ tags : newTags, badTags : deletedTags }),
            });
            if (!res.ok) {
                throw new Error("Failed to update tags");
            }
        }   catch (err) {
            console.error(err);
        }
    }

    const registrationDate = user?.createdAt? 
    new Date(user.createdAt).toLocaleDateString() 
    : 
    "Unknown registration date";
    

    if (isLoadingMain){
        return(
            <Card className="w-full sm:w-[520px] md:w-[700px] lg:w-[760px] min-h-[760px] flex flex-col items-center">
                <CardContent className="flex flex-col items-center w-3/4 pt-6">
                    <div className="flex flex-row w-full justify-evenly">
                        <Skeleton className="h-28 w-28 md:h-40 md:w-40 rounded-full" />
                        <div className="flex flex-col justify-center h-full w-1/2 gap-y-2">
                            <Skeleton className="h-7 w-44" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-6 w-36" />
                        </div>
                    </div>
                    <div className="space-y-6 my-6 w-full flex flex-col items-center">
                        <Skeleton className="h-[1px] w-full"/>
                        <div className="flex flex-row w-full justify-around">
                        <Skeleton className="h-6 w-2/5" />
                        <Skeleton className="h-6 w-2/5" />
                        </div>
                        <Skeleton className="h-[500px] w-full" />
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
        <Card className="w-full sm:w-[540px] md:w-[700px] lg:w-[760px] h-fit flex flex-col items-center pb-7 relative">
            <div className={`absolute right-8 top-8 opacity-50 ${isCurrentUser ? "" : "hidden"} `}>
                <Settings className="hover:animate-spin-slow active:scale-90 text-subtext w-8 h-8" onClick={redirectToUserProfile}/>
            </div>
            <CardHeader className="flex flex-row flex-shrink items-center justify-evenly border-b w-3/4 pb-4 mb-4 gap-x-2">
                <Avatar className="border-2 border-subtext h-28 w-28 md:h-40 md:w-40">
                    <AvatarImage src={user?.imageUrl} alt={user?.username || "User"} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center md:items-start min-w-fit w-1/2 h-full">
                    <CardTitle className="text-lg md:text-2xl max-w-full font-bold uppercase">{user?.username}</CardTitle>
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
                {!isLoadingTags 
                ? (
                    <Tags 
                        content={userTags || []}
                        editable={isCurrentUser || false}
                        onSave={handleTagsChange}    
                    />
                ) : (
                    <div className="flex flex-row justify-start w-full gap-4 ">
                         <Skeleton className="w-20 h-10 rounded-lg" />
                         <Skeleton className="w-32 h-10 rounded-lg" />
                         <Skeleton className="w-24 h-10 rounded-lg" />
                         <Skeleton className="w-10 h-10 rounded-lg" />
                         
                    </div>
                )}
            </CardContent>
        </Card>

    )
}