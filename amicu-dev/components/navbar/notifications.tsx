import { Bell } from "lucide-react";
import { Button } from "../ui/button";

export function Notifications() {
    return (
       <Button type="button" variant="navbar" className="px-2.5 hidden sm:block">
            <Bell />
       </Button> 
    );
}