import { SidebarTrigger } from "../ui/sidebar";
import { Searchbar } from "./searchbar";
import { Notifications } from "./notifications";
import { ModeToggle } from "../theme_provider/theme-toggle";
import { Personal } from "./personal";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInButton from "./sign-in-button";
import SignUpButton from "./sign-up-button";
import Image from "next/image";


function Navbar() {
    return(
        <nav className="bg-navbar-background mx-0 mb-4 border-b-2 justify-items-center px-4 fixed top-0 w-full">
            <div className='w-full flex flex-row gap-y-5 gap-x-14 sm:justify-between sm:items-center sm:gap-x-20 py-3 items-center'>
                <div className="flex items-center">
                    <SidebarTrigger />
                    <span className="text-white text-2xl font-mono font-semibold hidden sm:block">AmicuDev</span>
                    <Image 
                        src="/favicon.ico"
                        alt="AmicuDev"
                        width={50}
                        height={50}
                        className="sm:hidden"
                    />
                </div>
                <div>
                    <Searchbar />
                </div>
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <Notifications />
                        <Personal />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                        <SignUpButton className="hidden lg:block"/>
                    </SignedOut>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;