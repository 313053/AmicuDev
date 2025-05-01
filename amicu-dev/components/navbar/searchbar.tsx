import { Input } from "../ui/input";
import { Search} from 'lucide-react';

export function Searchbar(){
    return(
        <div className="flex size-fit max-w-sm items-start space-x-2 w-1/3 sm:w-full relative">
            <Input type="email" placeholder="Search" className="pl-10 border-navbar-primary text-white placeholder:text-navbar-primary placeholder:opacity-80"/>
            <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-navbar-primary opacity-80" />
        </div>
    );
}


