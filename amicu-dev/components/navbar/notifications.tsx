'use client' 
import { Bell, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { NotificationData, NotificationPostData } from "@/lib/types/notificationTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";


interface NotificationCardProps {
    notification: NotificationData
}

export function Notifications() {
    const [ alert, setAlert ] = useState(false);
    const [ notifications, setNotifications ] = useState<NotificationData[] | null>(null);
    const [ loading, setLoading ] = useState(false);

    // Change this to tweak fake real-time data fetching
    const intervalLength = 30000;

    const checkNotifications = async () => {
        try {
            const response = await fetch(`/api/user/notifications/check`);

            if (!response.ok) {
                throw new Error(`Failed to fetch notification data: ${response.status}`);
            }

            const payload : { presence : boolean,  } = await response.json();
            setAlert(payload.presence);
        } catch (error) {
            console.error("Error checking for notifications: ", error);
        }
    } 

    // Checking for notifications every x seconds
    useEffect(() => {
        checkNotifications();

        const interval = setInterval(() => {
            checkNotifications();
        }, intervalLength);

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/notification/get-notifications`);

            if (!response.ok) {
                throw new Error(`Failed to fetch notification data: ${response.status}`);
            }

            const payload = await response.json();
            setNotifications(payload.data);
            setLoading(false);
            await setAllAsRead();
        } catch (error) {
            console.error("Error checking for notifications: ", error);
        }
    }

    const setAllAsRead = async () => {
        try {
            const response = await fetch(`/api/notification/set-read-status`, {
                method: "PUT"
            });

            if(!response.ok) {
                throw new Error("Failed to set notifications as read");
            }
        } catch (error) {
            console.warn("Failed to set notifs as read: ", error);
        }
    }

    const handleNotificationExpand = async () => {
        setAlert(false);
        await fetchNotifications();
    }

    return (
        <Popover onOpenChange={handleNotificationExpand}>
            <PopoverTrigger asChild>
                <Button type="button" variant="navbar" className="px-2.5 relative">
                    <Bell/>
                        <div className={`${alert ? "block absolute -top-1 -right-1" : "hidden"} w-3 h-3 rounded-full bg-red-500 animate-ping`}/>
                        <div className={`${alert ? "block absolute -top-1 -right-1" : "hidden"} w-3 h-3 rounded-full bg-red-500`}/>  
                </Button> 
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-80 z-20 mr-2 gap-y-6 max-h-60 overflow-y-scroll">
                    { notifications 
                        ? (
                            notifications.map((notif, index) => (
                                <div key={index} className="flex flex-col gap-y-6">
                                    <div className={`w-full border-t border-separator 
                                        ${index === 0 
                                            ? "hidden" 
                                            : ""}`}/>
                                    <NotificationCard notification={notif}/>
                                </div>
                            ))
                        ) : (
                            loading 
                                ? (
                                    Array.from({ length : 2}).map((_,i) => (
                                        <div key={i}>
                                            <Skeleton className="w-full h-16"/>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        You have no notifications
                                    </div>
                                )
                        )   
                    }
                    <div className={notifications?.length === 0 ? "" : "hidden"}>
                        You have no notifications
                    </div>
            </PopoverContent>
        </Popover>
    );

    function NotificationCard( { notification }  : NotificationCardProps ) {
        const sender = notification.sender;
        const project = notification.project;
        const messages = [
            `${sender.username} would like to join "${project.title}"`,
            `You've been invited to join "${project.title}"`,
        ]
        const message = messages[notification.type-1];

        const acceptRequest = async () => {
            const bodyData : NotificationPostData = {
                id: notification.id,
                senderId: notification.sender.id,
                projectId: notification.project.id,
                type: notification.type
            }
            try {
                const response = await fetch(`/api/notification/response/accept`, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify(bodyData)
                });

                if (!response.ok) {
                    throw new Error(`Failed to accept request: ${response.status}`);
                }
                toast("Request accepted!");
                fetchNotifications();
                return true;
            } catch (error) {
                console.error("Error accepting request: ", error);
                toast.error("Server Error: Failed to accept request");
            } 
        }

        const rejectRequest = async () => {
            const bodyData : NotificationPostData = {
                id: notification.id,
                senderId: notification.sender.id,
                projectId: notification.project.id,
                type: notification.type
            }
            try {
                const response = await fetch(`/api/notification/response/reject`, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify(bodyData)
                });

                if (!response.ok) {
                    throw new Error(`Failed to reject request: ${response.status}`);
                }
                toast("Request rejected!");
                fetchNotifications();
                return true;
            } catch (error) {
                console.error("Error rejecting request: ", error);
                toast.error("Server Error: Failed to reject request");
            } 
        }

        return (
            <div className="grid grid-rows-2 grid-cols-4 w-full max-h-36">
                <Link href={`/account/${sender.clerkId}`} title="user profile" className="row-span-2 col-span-1">
                    <Avatar className="w-14 h-14 sm:w-16 sm:h-16 hover:opacity-70">
                        <AvatarImage src={sender.avatarUrl} alt={sender.username || "user"}/>
                        <AvatarFallback><User2 className="h-full w-full"/></AvatarFallback>
                    </Avatar>
                </Link>
                <div className="row-span-1 col-span-3 pl-1">
                    <p className="text-xs line-clamp-2" title={message} >
                        {message}
                    </p>
                </div>
                <div className="row-span-1 col-span-1 justify-self-center p-1">
                    <Button variant="navbar" size="sm" className="h-4 p-3" onClick={acceptRequest}>
                        Accept
                    </Button>
                </div>
                <div className="row-span-1 col-span-1 justify-self-center items-center p-1">
                    <Button variant="navbar" size="sm" className="h-4 p-3" onClick={rejectRequest}>
                        Reject
                    </Button>
                </div>
            </div>
        )
    }
}