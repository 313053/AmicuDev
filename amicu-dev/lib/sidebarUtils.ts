import { Compass, Home, LucideIcon} from "lucide-react";

type SidebarLink = {
    name: string;
    url: string;
    icon: LucideIcon;
}

export const sidebarLinks: SidebarLink[] = [
    { name: "Home", url: "/", icon: Home},
    { name: "Explore", url: "/explore", icon: Compass},
];

