'use client'

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarTrigger } from "@/components/ui/sidebar";
import { sidebarLinks } from "@/lib/sidebarUtils";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronRight, CirclePlus, Folder, FolderCode, Moon, SendHorizonal, Sun } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import SignInButton from "../navbar/sign-in-button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ProjectSidebarData } from "@/lib/types/projectTypes";

export function AppSidebar() {
    const { theme, setTheme } = useTheme();
    const [ projects, setProjects ] = useState<ProjectSidebarData[] | null>(null);
    const { user, isLoaded } = useUser();

    const fetchProjectTitles = async () => {
        if (!user)
            return;
        try {
            const response = await fetch(`/api/user/get-user/${user.id}/projects-mini`);
            if (!response.ok)
                throw new Error(`Error fetching user projects: ${response.status}`);
            const payload = await response.json();
            console.log(payload)
            setProjects(payload.data);
        } catch (error) {
            console.error("Error fetching project names: ", error)
        }
    }

    useEffect(() => {
        fetchProjectTitles();
    },[isLoaded]);

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="pt-3">
                <div className="flex flex-row align-middle w-full">
                    <span className="text-white text-2xl font-mono font-semibold">AmicuDev</span>
                    <div className="w-full text-right">
                        <SidebarTrigger />
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SignedIn>
                    <SidebarMenu>
                        {sidebarLinks.map((link) => (
                            <SidebarMenuItem key={link.name}>
                                <SidebarMenuButton asChild>
                                    <Link href={link.url}>
                                        <link.icon />
                                        <span className="text-white font-mono">{link.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a
                                    href="https://github.com/313053/AmicuDev/issues/new"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <SendHorizonal />
                                    <span className="text-white font-mono">Feedback</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                onClick={() =>
                                    theme === "light"
                                        ? setTheme("dark")
                                        : setTheme("light")
                                }
                            >
                                <div>
                                    {theme === 'dark'
                                        ? <Moon />
                                        : <Sun />
                                    }
                                    <span className="text-white font-mono">Theme</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarMenu>
                        <Collapsible defaultOpen={false} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <FolderCode />
                                        <span className="text-white font-mono">Projects</span>
                                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        { projects?.map((project) => (
                                             <SidebarMenuSubItem key={project.title}>
                                                <SidebarMenuButton asChild>
                                                    <Link href={`/project/${project.id}`}>
                                                        <Folder />
                                                        <span className="text-white font-mono text-xs">{project.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuSubItem>                                           
                                        )) }
                                        { (!projects || projects.length === 0) && (
                                             <SidebarMenuSubItem>
                                                <SidebarMenuButton asChild>
                                                    <Link href={`/account/${user?.id}/projects/new`}>
                                                        <CirclePlus />
                                                        <span className="text-white font-mono text-xs">Create new project</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuSubItem>  
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SignedIn>
                <SignedOut>
                    <div className="w-full h-full px-5 flex flex-col justify-center items-center gap-y-5">
                        <p className="text-xl">Sign in to access user features</p>
                        <SignInButton />
                    </div>
                </SignedOut>
            </SidebarContent>
        </Sidebar>
    );
}
