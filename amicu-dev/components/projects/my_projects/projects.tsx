'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReducedClerkData } from "@/lib/types/profileTypes";
import { ProjectCardData } from "@/lib/types/projectTypes";
import { useClerk, useUser } from "@clerk/nextjs"
import { Settings, User2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Props {
    userProjects : ProjectCardData[],
    user : ReducedClerkData | null,
    error? : string
}


export default function ProjectsCard({userProjects, user, error } : Props) {
    const noProjects = userProjects.length <= 0;
    const userId = useParams().id
    const { user : currentUser, isLoaded : isAuthLoaded } = useUser();
    const { redirectToUserProfile } = useClerk();
    const isCurrentUser = (isAuthLoaded && currentUser && currentUser.id === userId);


    if (error) {
        return (
            <div className="flex justify-center">
                <Card className="sm:w-[640px] flex flex-col items-center p-6">
                    <div className="text-center font-bold">
                        <p>Error loading user projects</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row justify-center gap-x-2">
        <Card className="w-full h-fit max-w-4xl lg:w-5/6 relative">
            <CardContent className="h-fit">
                <div className="min-h-96 flex flex-col items-center p-2">
                    <div className="absolute top-0 h-11 w-full bg-sidebar rounded-t-xl z-0" />
                    <p className="text-xl text-sidebar-foreground font-semibold relative z-10">{user?.firstName || "user"}&apos;s projects</p>
                    {noProjects 
                    ? (
                        <div className="h-[480px] w-full flex flex-col justify-center items-center text-2xl">
                            { isCurrentUser ? (
                                <div className="w-full h-full flex flex-col justify-center items-center text-2xl gap-4">
                                    <p>You have no projects yet.</p>
                                    <Button>
                                        Create One
                                    </Button>
                                </div>
                            ) : (
                                <p>This user has no projects yet.</p>
                            )}
                        </div>
                    )
                    : (
                        <div className="w-full h-[480px] flex flex-wrap gap-4 justify-start sm:justify-start content-start overflow-y-auto py-6">
                        {userProjects.map((project, index) => (
                            <ProjectMiniature content={project} key={index}/>
                        ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
        <Card className="w-72 max-w-4xl hidden lg:flex lg:flex-col relative bg-sidebar shadow-2xl">
            <CardContent>
                <div className="h-96 flex flex-col items-center p-4 relative">
                    <Link href={"/account/" + userId} title="User Profile">
                        <Avatar className="border-2 border-sidebar-subtext shadow-lg h-40 w-40">
                            <AvatarImage src={user?.imageUrl} alt={user?.username || "User"}></AvatarImage>
                            <AvatarFallback><User2 className="h-32 w-32 opacity-50 blur-sm"/></AvatarFallback>
                        </Avatar>
                    </Link>
                    {isCurrentUser && (
                        <Settings className="absolute left-36 top-36 hover:animate-spin-slow active:scale-90 fill-sidebar-foreground text-sidebar-subtext w-8 h-8" onClick={redirectToUserProfile}/>
                    )}
                        <p className="text-xl font-semibold text-sidebar-foreground">{user?.firstName} {user?.lastName}</p>
                        <p className="text-lg italic text-sidebar-foreground opacity-40">{user?.username}</p>
                </div>
            </CardContent>
        </Card>
        </div>
    )
}

export function ProjectMiniature( { content } : { content : ProjectCardData }) {
    return (
        <div className="flex flex-row w-[250px] h-14 items-center justify-center gap-x-4 hover:bg-card-textArea hover:animate-pulse rounded-lg">
            <Avatar className="w-14 h-full rounded-3xl bg-card-textArea">
                <AvatarImage src={content.thumbnail} alt="thumbnail" />
                <AvatarFallback className="w-full h-full bg-card-textArea"><p className="text-3xl font-bold">{content.title[0].toUpperCase()}</p></AvatarFallback>
            </Avatar>
            <div className="w-5/6 h-5/6 grid grid-rows-2 overflow-hidden">
                <p className="font-bold truncate">{content.title}</p>
                <p className="truncate">{content.description}</p>
            </div>
        </div>
    )
}