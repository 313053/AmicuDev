import { Clock, Crown, Github, Users } from "lucide-react";
import Link from "next/link";

interface ProjectStatsProps {
    memberCount : number,
    creator : {id : string; username : string}
    github : string
    creationDate : Date
    interloper : boolean
}

export default function ProjectStats({ memberCount, creator, github, creationDate, interloper } : ProjectStatsProps ) {
    
    return (
        <div className="flex flex-col items-center w-full gap-y-3 text-sidebar-foreground opacity-50">
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row items-center justify-start gap-x-1">
                    <Crown className="w-4 h-4"/>
                    <p>Creator:</p>
                </div>
                <Link href={`/account/${creator.id}`} className="w-1/2">
                    <p className="text-right truncate hover:underline">{creator.username}</p>
                </Link>
            </div>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row items-center justify-start gap-x-1">
                    <Users className="w-4 h-4"/>
                    <p>Members:</p>
                </div>
                <p className="text-right truncate w-1/2">{memberCount}</p>
            </div>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row items-center justify-start gap-x-1">
                    <Github className="w-4 h-4"/>
                    <p>Github Repo:</p>
                </div>
                { github.trim() === "" 
                ? (
                    <p className="text-right truncate w-1/2">no</p>  
                ) : interloper 
                    ? (
                        <p title="MEMBERS ONLY">yes</p>
                    ) : (
                        <a href={github} target="_blank" rel="noopener noreferrer" title="github.com" className="text-right truncate w-1/2 hover:underline" >
                            <p>yes</p>
                        </a>
                )}
            </div>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row items-center justify-start gap-x-1">
                    <Clock className="w-4 h-4"/>
                    <p>Created:</p>
                </div>
                <p className="text-right truncate w-1/2">{creationDate.toLocaleDateString()}</p>
            </div>
        </div>
    )
}