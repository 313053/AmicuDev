'use client'

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarTrigger } from "@/components/ui/sidebar"
import { sampleProjects, sidebarLinks } from "@/lib/sidebarUtils"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ChevronRight, FolderCode, Moon, Sun } from "lucide-react"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import SignInButton from "../navbar/sign-in-button"
import { useTheme } from "next-themes"

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
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
      <SidebarContent >
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
              <SidebarMenuButton asChild onClick={() => (theme === "light") ? setTheme("dark") : setTheme("light")}>
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
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"/>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {sampleProjects.map((project) => (
                        <SidebarMenuSubItem key={project.name}>
                          <SidebarMenuButton asChild>
                            <Link href={project.url}>
                              <span className="text-white font-mono">{project.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
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
  )
}
