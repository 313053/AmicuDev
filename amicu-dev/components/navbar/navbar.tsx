import { SidebarTrigger } from "../ui/sidebar";
import Searchbar from "./searchbar";

function Navbar() {
    return(
        <nav className="bg-navbar-background mx-0">
            <div className='container flex flex-col flex-wrap gap-4 sm:flex-row sm:justify-between sm:items-center py-3 px-4'>
                <div>
                <SidebarTrigger />
                <span className="text-secondary text-xl font-mono font-semibold">AmicuDev</span>
                </div>
                <Searchbar />
                <span>.</span>
            </div>
        </nav>
    );
}

export default Navbar;