'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Bug, FolderCode, LogOut, Mail, Settings, User, Users } from "lucide-react";
import UserAvatar from "../user_avatar/user-avatar";
import { SignOutButton } from "@clerk/nextjs";
import { GetAccountLink } from "@/lib/links";
import Link from "next/link";

  export function Personal() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href={GetAccountLink()}>
                    <DropdownMenuItem>
                        <User />
                        <span>My Profile</span>
                    </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                        <Mail />
                        <span>My Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Users />
                        <span>My Teams</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <FolderCode />
                        <span>My Projects</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Bug />
                        <span>Contact Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <SignOutButton>
                        <DropdownMenuItem>
                            <LogOut />
                            <span>Log Out</span>
                        </DropdownMenuItem>
                    </SignOutButton>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }