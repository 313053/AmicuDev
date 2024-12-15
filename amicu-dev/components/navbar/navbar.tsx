import { SidebarTrigger } from "../ui/sidebar";
import { Searchbar } from "./searchbar";
import { Notifications } from "./notifications";
import { ModeToggle } from "../theme_provider/theme-toggle";
import { Personal } from "./personal";


function Navbar() {
    return(
        <nav className="bg-navbar-background mx-0 mb-4 border-b-2 justify-items-center px-4 fixed top-0 w-full">
            <div className='w-full container flex flex-col flex-wrap gap-5 sm:flex-row sm:justify-between sm:items-center sm:gap-x-20 py-3'>
                <div>
                    <SidebarTrigger />
                    <span className="text-white text-2xl font-mono font-semibold">AmicuDev</span>
                </div>
                <div>
                    <Searchbar />
                </div>
                <div className="flex items-center gap-4">
                    <Notifications />
                    <Personal />
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;