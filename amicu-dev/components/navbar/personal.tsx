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
import { Bug, FolderCode, LogOut, Settings, User } from "lucide-react";
import UserAvatar from "../user_avatar/user-avatar";
import { SignOutButton, useClerk } from "@clerk/nextjs";
import { GetAccountLink } from "@/lib/links";
import Link from "next/link";

  export function Personal() {
    const { redirectToUserProfile } = useClerk();

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
                    <Link href={`${GetAccountLink()}/projects`}>
                        <DropdownMenuItem>
                            <FolderCode />
                            <span>My Projects</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="https://github.com/313053/AmicuDev/issues/new" target="_blank" rel="noopener noreferrer">
                        <DropdownMenuItem>
                            <Bug />
                            <span>Contact Support</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={redirectToUserProfile}>
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