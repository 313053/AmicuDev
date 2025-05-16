'use client'
import { Card, CardContent } from "@/components/ui/card"
import { ProjectDashboardData } from "@/lib/types/projectTypes"
import ProjectTitleEdit from "./projectTitle"
import { useState } from "react"

interface ProjectDashboardProps {
    content : ProjectDashboardData
}

export default function ProjectDashboard({ content } : ProjectDashboardProps) {
    const [ tab, setTab ] = useState(1);

    return (
        <div className="flex flex-col h-auto min-h-[800px] w-full -mt-10 items-center gap-y-2">
            <Card className="h-auto min-h w-full sm:w-5/6 bg-sidebar border-none">
                <CardContent className="py-2 px-3 sm:px-6 flex flex-col sm:flex-row justify-between items-center relative gap-y-2">
                    <div className="flex flex-row justify-center sm:justify-start items-center content-center gap-x-2 w-full sm:w-1/2 h-auto overflow-hidden">
                        <ProjectTitleEdit projectId={content.id} value={content.title}/>
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
            <div className="flex flex-row h-fit min-h-[720px] w-full sm:w-5/6 gap-x-2">
                <Card className="h-fit min-h-[640px] w-full">
                    
                </Card>
                <Card className="h-fit min-h-[640px] w-2/6  min-w-60 bg-sidebar hidden md:block">

                </Card>
            </div>
        </div>
    )
}