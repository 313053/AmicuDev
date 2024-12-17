import { Input } from "../ui/input";
import { Search} from 'lucide-react';

export function Searchbar(){
    return(
        <div className="flex size-fit w-20 max-w-sm items-center space-x-2 ml-5 sm:w-full">
            <div className="relative">
            <Input type="email" placeholder="Search" className="pl-10 border-navbar-primary text-white placeholder:text-navbar-primary placeholder:opacity-80"/>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navbar-primary opacity-80" />
            </div>
        </div>
    );
}


