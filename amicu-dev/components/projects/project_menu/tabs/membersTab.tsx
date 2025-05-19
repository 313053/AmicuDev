'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProjectMemberData } from "@/lib/types/projectTypes";
import { Ban, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface MembersTabProps {
    projectId: bigint;
    modPriviledges: boolean;
}
interface ProjectMemberCardProps {
    data: ProjectMemberData;
}

export default function MembersTab({ projectId, modPriviledges } : MembersTabProps) {
    const [ loadingState, setLoadingState ] = useState(false);
    const [ projectMembers, setProjectMembers ] = useState<ProjectMemberData[] | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    const fetchProjectUserData = async () => {
        if (!projectId) {
            return;
        }
        try {
            setLoadingState(true);
            const response = await fetch(`/api/project/${projectId}/get-users`);

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.status}`);
            }
            const payload = await response.json();
            setProjectMembers(payload.data);
            setLoadingState(false);
        } catch (err) {
            console.error("Error fetching project member data: ", err);
            setError(err instanceof Error ? err.message : "Unknown error occured");
            setLoadingState(false);
        }
    }

    useEffect(() => {
        fetchProjectUserData();
    }, [projectId]);

    if (loadingState)

    if (error) {
        return(
            <CardContent className="flex flex-col gap-6 h-full w-full pb-10 pt-8">
                <div className="h-full w-full flex-row justify-center items-center">
                    <p className="text-2xl text-center font-semibold">{error}</p>
                </div>
            </CardContent>
        )
    }

    return (
        <CardContent className="flex flex-col gap-6 h-auto w-full pb-10 pt-8">
            <p className="text-left text-2xl font-semibold">Project Members</p>
            <div className="flex flex-col md:flex-row md:flex-wrap justify-start content-start gap-4 h-auto w-full">
                { projectMembers?.map((member, index) => (
                    <div key={index} className="flex flex-row gap-x-4 w-full md:w-56">
                        <ProjectMemberCard data={member}/>
                        { index < projectMembers.length-1 && (<div className="hidden md:block border-l border-separator"/>)}
                    </div>
                ))}
            </div>
        </CardContent>
    )

    function ProjectMemberCard ( { data } : ProjectMemberCardProps) {
        const [ loading, setLoading ] = useState(false);
        const closeRef = useRef<HTMLButtonElement>(null);
        const badges = [
            "Creator",
            "Admin",
            "Member"
        ]

        async function handleRemoveUser() {
            setLoading(true);
            try {
                const res = await fetch(`/api/project/${projectId}/remove-user`,{
                    method: "DELETE",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({ removedUserId: data.id })
                });
                if (!res.ok) {
                    throw new Error("Failed to remove project member");
                }
                fetchProjectUserData();
                setLoading(false);
                closeRef.current?.click();
                return true;
            } catch (err) {
                setLoading(false);
                console.error(err);
                return false;
            }
        }

        return (
            <Card className="h-20 w-full md:w-52 bg-card-textArea relative">
                <CardContent className="flex flex-row h-full w-full gap-2 justify-start items-center py-2 px-4">
                    <Link href={`/account/${data.clerkId}`}>
                        <Avatar className="w-12 h-12 hover:brightness-150 hover:contrast-75">
                            <AvatarImage src={data.imageUrl} alt="avatar" />
                            <AvatarFallback className="w-full h-full">
                                <User className="w-full h-full"/>
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-col justify-center items-start w-4/6">
                        <Badge className="bg-button hover:bg-button">{badges[data.role-1]}</Badge>
                        <Link href={`/account/${data.clerkId}`}>
                            <p className="text-sm font-semibold truncate w-full hover:underline">{data.username}</p>
                        </Link>
                    </div>
                    { modPriviledges && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <button title="ban user" className="hidden md:block absolute right-1 top-1 text-red-500 hover:opacity-50" >
                                    <Ban size={17}/>
                                </button>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                                <button title="ban user" className="md:hidden absolute right-2 text-red-500 hover:opacity-50" >
                                    <Ban size={30}/>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Confirmation</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to remove {data.username} from the project?
                                    </DialogDescription>
                                </DialogHeader>
                                <Button variant="destructive" className={`text-lg font-semibold ${loading && "opacity-50 animate-pulse"}`} onClick={handleRemoveUser}>
                                    Yes I&apos;m sure
                                </Button>
                                <DialogClose asChild>
                                    <Button ref={closeRef} className="hidden" />
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardContent>
            </Card>
        )
    }
}