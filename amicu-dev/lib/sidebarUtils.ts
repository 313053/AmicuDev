import { Compass, Home, LucideIcon, Mail, SendHorizonal } from "lucide-react";

type SidebarLink = {
    name: string;
    url: string;
    icon: LucideIcon;
}

export const sidebarLinks: SidebarLink[] = [
    { name: "Home", url: "/", icon: Home},
    { name: "Explore", url: "/explore", icon: Compass},
    { name: "Messages", url: "/", icon: Mail},
];

export const sampleProjects: SidebarLink[] = [
    { name: "Project_1", url: "/", icon: Home},
    { name: "Project_2", url: "/", icon: Compass},
    { name: "Project_3", url: "/", icon: Mail},
    { name: "Project_4", url: "/", icon: SendHorizonal}
]
