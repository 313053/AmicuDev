"use client"

import ProfileCard from "@/components/profile/profile";
import { useParams } from "next/navigation";

export default function Account() {
    const params = useParams()
    const userId = params.id as string
    
    return(
        <div className="flex flex-col items-center w-full h-full">
            <ProfileCard userId={userId}/>
        </div>
    );
}