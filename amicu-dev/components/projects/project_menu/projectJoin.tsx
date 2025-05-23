'use client'

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Loader, UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner";


interface ProjectJoinProps {
    projectId: bigint
}

export default function ProjectJoin({ projectId }: ProjectJoinProps) {
    const [ waiting, setWaiting ] = useState(false);
    const [ sending, setSending ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const { user } = useUser();

    const checkWaitlistPresence = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/project/${projectId}/check-waitlist`);

            if (!response.ok) {
                toast.error("Server Error: Failed to check if user is in waitlist");
                throw new Error(`Failed to check if user is in waitlist: ${response.status}`);
            }

            const payload : { presence : boolean } = await response.json();
            setWaiting(payload.presence);
        } catch (error) {
            console.error("Error fetching waitlist info: ", error);
            toast.error("Server Error: Failed to check if user is in waitlist");

        } finally {
            setLoading(false);
        }
    }

    const sendRequest = async () => {
        setSending(true);
        try {
            const response = await fetch(`/api/project/${projectId}/send-join-request`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ userId: user?.id })
            });

            if (!response.ok) {
                toast.error("Server Error: Failed to send join request");
                throw new Error(`Failed to send join request: ${response.status}`);
            }
            toast("Join request sent!")
            checkWaitlistPresence();
            return true;
        } catch (error) {
            console.error("Error putting user in waitlist: ", error)
            toast.error("Something went wrong! Try again later");
        } finally {
            setSending(false);
        }
    }

    const cancelRequest = async () => {
        setSending(true);
        try {
            const response = await fetch(`/api/project/${projectId}/cancel-join-request`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ userId: user?.id, invite: false})
            });

            if (!response.ok) {
                toast.error("Server Error: Failed to cancel join request");
                throw new Error(`Failed to cancel join request: ${response.status}`);
            }
            toast("Join request cancelled!")
            checkWaitlistPresence();
            return true;
        } catch (error) {
            console.error("Error removing user from waitlist: ", error)
            toast.error("Something went wrong! Try again later");
        } finally {
            setSending(false);
        }
    }

    useEffect(() => {
        checkWaitlistPresence();
    }, [projectId, user]);

    return (
        <Button
            className="w-full lg:w-auto lg:text-black lg:bg-sidebar-foreground lg:hover:bg-sidebar-foreground/90 z-10"
            disabled={sending || loading}
            onClick={waiting ? cancelRequest : sendRequest}
            >
            <span className={`${!waiting && "hidden"} flex items-center gap-x-1`}>
                <UserMinus className={sending ? "hidden" : ""}/> 
                <Loader  className={sending ? "animate-spin-slow" : "hidden"}/>
                Cancel Request
            </span>
            <span className={`${waiting && "hidden"} flex items-center gap-x-1`}>
                <UserPlus className={sending ? "hidden" : ""}/>
                <Loader  className={sending ? "animate-spin-slow" : "hidden"}/>
                Join Project
            </span>
        </Button>
    )
}