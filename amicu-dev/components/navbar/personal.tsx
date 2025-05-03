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
import { Bug, FolderCode, LogOut, Mail, Settings, User } from "lucide-react";
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
                    <DropdownMenuItem>
                        <Mail />
                        <span>My Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <FolderCode />
                        <span>My Projects</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="https://github.com/313053/AmicuDev/issues/new">
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