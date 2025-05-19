'use client'
import { Card, CardContent } from "@/components/ui/card"
import { ProjectDashboardData } from "@/lib/types/projectTypes"
import ProjectTitleEdit from "./projectTitle"
import { useState } from "react"
import { AddProjectLink, ProjectLink } from "./projectLinks"
import { Link, Tag } from "lucide-react"
import ProjectTags from "./projectTags"
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar"
import ProjectStats from "./projectStats"
import ProjectDescriptioEdit from "./projectDescription"
import ProjectDescriptionEdit from "./projectDescription"

interface ProjectDashboardProps {
    content : ProjectDashboardData
}

export default function ProjectDashboard({ content } : ProjectDashboardProps) {
    const [ tab, setTab ] = useState(1);
    const hasLinks = (content.links && content.links.length !== 0);
    const modPiviledges = content.role === 1 || content.role === 2;
    return (
        <div className="flex flex-col h-auto min-h-[800px] w-full -mt-10 mb-20 items-center gap-y-2">
            <Card className="h-auto min-h-10 w-full sm:w-5/6 bg-sidebar border-none">
                <CardContent className="py-2 px-3 sm:px-6 flex flex-col sm:flex-row justify-between items-center relative gap-y-2">
                    <div className="flex flex-row justify-center sm:justify-start items-center content-center gap-x-2 w-full sm:w-1/2 h-auto overflow-hidden">
                        { modPiviledges && <ProjectTitleEdit projectId={content.id} value={content.title}/>}
                        <p className="text-3xl text-sidebar-foreground font-semibold text-wrap break-words truncate w-auto min-h-10 max-w-3/4">{content.title}</p>
                    </div>
                    <div className="flex flex-row justify-around sm:justify-end w-full sm:w-1/2 h-full items-center">
                        <button className={
                                `p-2 text-sidebar-foreground font-semibold rounded-lg w-1/3 sm:w-auto
                                ${tab === 0 
                                    ? "border-b-2 border-sidebar-foreground rounded-b-none" 
                                    : "hover:bg-sidebar-accent opacity-50 hover:opacity-100"}`
                                }
                                onClick={() => tab !== 0 && setTab(0)}>
                            About
                        </button>
                        <button className={
                                `p-2 text-sidebar-foreground font-semibold rounded-lg w-1/3 sm:w-auto
                                ${tab === 1 
                                    ? "border-b-2 border-sidebar-foreground rounded-b-none" 
                                    : "hover:bg-sidebar-accent opacity-50 hover:opacity-100"}`
                                }
                                onClick={() => tab !== 1 && setTab(1)}>
                            Members
                        </button>
                        <button className={
                                `p-2 text-sidebar-foreground font-semibold rounded-lg w-1/3 sm:w-auto
                                ${tab === 2 
                                    ? "border-b-2 border-sidebar-foreground rounded-b-none" 
                                    : "hover:bg-sidebar-accent opacity-50 hover:opacity-100"}`
                                }
                                onClick={() => tab !== 2 && setTab(2)}>
                            Github
                        </button>
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-row h-auto min-h-[720px] w-full sm:w-5/6 gap-x-2 items-stretch">
                <Card className=" w-full">
                    <CardContent className="flex flex-col gap-6 h-auto w-full pb-10 pt-12">
                        <div className="flex flex-col h-auto w-full gap-y-3">
                            <div className="flex flex-row gap-x-2">
                                { modPiviledges && (
                                    <ProjectDescriptionEdit projectId={content.id} value={content.title}/>
                                )}
                                <p className="text-left text-2xl font-semibold">About This Project</p>
                            </div>
                            <p className="text-left text-lg lg:text-xl bg-card-textArea h-auto min-h-80 w-full p-4 whitespace-pre-line rounded-lg">
                                {content.description}
                            </p>
                        </div>
                        { hasLinks 
                            ? (
                                <div className="flex flex-row h-auto w-full gap-2">
                                    <div className="flex flex-row font-semibold gap-x-1 items-center">
                                        <Link className="size-5"/>
                                        <p className="text-xl">Find us here:</p>
                                    </div>
                                    { content.links?.map((link, index) => (
                                        <div className="flex flex-row" key={index}>
                                            { index !== 0 && (
                                                <div className="pl-2 border-l border-separator"/>
                                            )}
                                            <ProjectLink url={link} />
                                        </div> 
                                    ))}
                                    { content.github && (
                                        <div className="pl-2 border-l border-separator content-center"><ProjectLink url={content.github}/></div>
                                        )}
                                    { modPiviledges && (
                                        <div className="pl-2 border-l border-separator content-center"><AddProjectLink projectId={content.id} content={content.links || []}/></div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-row h-auto w-full gap-2 items-center">
                                    { content.github && (
                                        <div className="flex flex-row items-center gap-x-2">
                                            <div className="flex flex-row font-semibold gap-x-1 items-center">
                                                <Link className="size-5"/>
                                                <p className="text-xl">Find us here:</p>
                                            </div>
                                            <div className="pr-2 border-r border-separator content-center"><ProjectLink url={content.github}/></div>
                                        </div>
                                        )}
                                    { modPiviledges && (
                                        <AddProjectLink projectId={content.id} content={content.links || []}/>
                                    )}
                                </div>
                            )
                        }
                        <div className="w-full border-b border-separator"/>
                        <div className="flex flex-col h-auto w-full gap-y-3 z-10">
                            <div className="flex flex-row font-semibold gap-x-1 items-center">
                                <Tag className="size-5"/>
                                <p className="text-xl">Tags</p>
                            </div>
                            <ProjectTags projectId={content.id} editable={modPiviledges}/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-2/6 min-w-60 bg-sidebar hidden md:block">
                        <CardContent className="flex flex-col h-full w-full items-center p-4 gap-y-6">
                            <Avatar className="bg-sidebar border-2 border-sidebar-subtext rounded-lg shadow-lg h-40 w-40">
                                <AvatarImage src={content.thumbnail} alt={content.title} />
                                <AvatarFallback className="flex items-center justify-center h-full w-full bg-sidebar">
                                    <p className="text-9xl text-sidebar-foreground font-bold leading-none -translate-y-1">
                                        {content.title[0].toUpperCase()}
                                    </p>
                                </AvatarFallback>
                            </Avatar>
                            <div className="border-b border-sidebar-foreground opacity-10 w-full"/>
                            <ProjectStats memberCount={content.memberCount} creator={content.creator} github={content.github} creationDate={content.createdAt}/>
                        </CardContent>
                </Card>
            </div>
        </div>
    )
}