'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReducedClerkData } from "@/lib/types/profileTypes";
import { ProjectCardData } from "@/lib/types/projectTypes";
import { useClerk, useUser } from "@clerk/nextjs"
import { Crown, Folder, Plus, Settings, User2, Wrench } from "lucide-react";
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

    const managedProjects = userProjects.filter((project) => [1,2].includes(project.role));
    const regularProjects = userProjects.filter((project) => project.role === 3);


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
        <div className="flex flex-col md:flex-row justify-center gap-x-2 -mt-20">
        <Card className="w-full h-fit min-h-[420.8px] max-w-4xl lg:w-5/6 relative">
            <CardContent className="h-fit">
                <div className="min-h-96 flex flex-col items-center p-2">
                    <div className="absolute top-0 h-11 w-full bg-sidebar rounded-t-xl z-0" />
                    <div className="flex flex-row justify-center items-center gap-x-2">
                        <p className="text-xl text-sidebar-foreground font-semibold relative z-10">{user?.firstName || "user"}&apos;s projects</p>
                    </div>
                    {noProjects 
                    ? (
                        <div className="h-[480px] w-full flex flex-col justify-center items-center text-2xl">
                            { isCurrentUser ? (
                                <div className="w-full h-full flex flex-col justify-center items-center text-2xl gap-4">
                                    <p>You have no projects yet.</p>
                                    <Link href={`/account/${userId}/projects/new`}>
                                        <Button>
                                            Create One
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <p>This user has no projects yet.</p>
                            )}
                        </div>
                    )
                    : (
                        <div className="w-full h-fit flex flex-col mt-6">
                            { managedProjects.length > 0 && (
                                <div className="flex flex-col">
                                    <p className="font-semibold text-xl">Projects {isCurrentUser ? "you" : "they"} manage</p>
                                    <div className="w-full h-fit flex flex-wrap gap-4 justify-start sm:justify-start content-start overflow-y-auto py-6">
                                        {managedProjects.map((project, index) => (
                                            <div key={index} className="flex flex-row gap-x-4">
                                                <ProjectMiniature content={project}/>
                                                {index < regularProjects.length-1 && (<div className="hidden sm:block border-l border-separator" />) }
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-b border-separator my-6"/>
                                </div>
                            )}
                            { regularProjects.length > 0 && (
                                <div className="flex flex-col">
                                    <p className="font-semibold text-xl">Projects {isCurrentUser ? "you" : "they"}&apos;ve joined</p>
                                    <div className="w-full h-fit flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-start sm:justify-start content-start overflow-y-auto py-6">
                                        {regularProjects.map((project, index) => (
                                            <div key={index} className="flex flex-row gap-x-4">
                                                <ProjectMiniature content={project}/>
                                                {index < regularProjects.length-1 && (<div className="hidden sm:block border-l border-separator" />) }
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-b border-separator my-6"/>
                                </div>
                            )}
                            {isCurrentUser && (
                                <Link href={`/account/${userId}/projects/new`}>
                                    <div className="flex flex-row justify-center">
                                        <Button variant="ghost" className="flex items-center w-1/3 min-w-52 text-xl opacity-50 hover:scale-105">
                                            <Plus className="align-middle -mb-[2px]" size={23} strokeWidth={4}/> Create new project 
                                        </Button>
                                    </div>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
        <Card className="w-72 max-w-4xl hidden lg:flex lg:flex-col relative bg-sidebar shadow-2xl">
            <CardContent>
                <div className="h-fit flex flex-col items-center p-4 relative">
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
                <div className="border-b border-sidebar-foreground w-full my-4 opacity-10"/>
                <div className="flex flex-col w-full h-fit gap-y-2">
                    <div className="flex flex-row justify-between text-md text-sidebar-foreground opacity-50">
                            <div className="flex flex-row items-center gap-1">
                                <Folder className="w-4 h-4"/>
                                <p>Projects:</p>
                            </div>
                            <p>{userProjects.length}</p>
                    </div>
                    <div className="flex flex-row justify-between text-md text-sidebar-foreground opacity-50">
                            <div className="flex flex-row items-center gap-1">
                                <Wrench className="w-4 h-4"/>
                                <p>Managed:</p>
                            </div>
                            <p>{managedProjects.length}</p>
                    </div>
                    <div className="flex flex-row justify-between text-md text-sidebar-foreground opacity-50">
                            <div className="flex flex-row items-center gap-1">
                                <Crown className="w-4 h-4"/>
                                <p>Created:</p>
                            </div>
                            <p>{userProjects.filter((project) => project.role === 1).length}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        </div>
    )
}

export function ProjectMiniature( { content } : { content : ProjectCardData }) {
    return (
        <div className="flex flex-row w-[250px] h-14 items-center justify-center gap-x-4 hover:bg-card-textArea hover:animate-pulse rounded-lg" title={content.title}>
            <Avatar className="w-14 h-full rounded-xl bg-card-textArea">
                <AvatarImage src={content.thumbnail} alt="thumbnail"/>
                <AvatarFallback className="w-full h-full bg-card-textArea"><p className="text-3xl font-bold">{content.title[0].toUpperCase()}</p></AvatarFallback>
            </Avatar>
            <div className="w-5/6 h-5/6 grid grid-rows-2 overflow-hidden">
                <p className="font-bold truncate">{content.title}</p>
                <p className="truncate">{content.description.length > 0 ? content.description : "No description yet." }</p>
            </div>
        </div>
    )
}