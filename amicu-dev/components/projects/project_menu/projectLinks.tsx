'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { allowedIcons, linkValidation } from "@/lib/links"
import { CirclePlus, Plus, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface LinkProps {
    url : string
}

interface AddLinkProps {
    projectId : bigint
    content : string[]
}

export function ProjectLink ({ url } : LinkProps) {

    const getDomain = () => {
        try {
            let hostname = new URL(url).hostname;
            if (hostname.includes("www.")) hostname = hostname.slice(4);
            return hostname;
        } catch {
            return null;
        }
    }

    const domain = getDomain() || "";


    const linkIcon = url.toLowerCase().includes("discord")
    ? '/discord.svg'
    : allowedIcons.includes(domain.toLowerCase())
        ? `https://${domain.toLowerCase()}/favicon.ico`
        : '/globe.svg';

    return(
        <a href={url} title={domain} target="_blank" rel="noopener noreferrer" className="content-center">
            <Image
                src={linkIcon}
                alt=""
                width={24}
                height={24}
                className="hover:scale-110"
            />
        </a>
    )
    
}

export function AddProjectLink( { projectId, content } : AddLinkProps) {
    const [ draftLinks, setDraftLinks ] = useState(content);
    const [ draftLink, setDraftLink ] = useState("");
    const [ linkError, setLinkError ] = useState(false);
    const [ loadingState, setLoadingState ] = useState(false);

    const closeRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();


    async function updateLinks() {
        setLoadingState(true);
        try {
            const res = await fetch(`/api/project/${projectId}/set-links`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ links : draftLinks })
            });
            if (!res.ok) {
                throw new Error("Failed to update project links");
            }
            setLoadingState(false);
            router.refresh();
            closeRef.current?.click();
        } catch (err) {
            console.error(err);
            setLoadingState(false);
            return false;
        }
    }

    const handleAddLink = () => {
        if (!validateInput())
            return;
        setDraftLinks((prev) => [
            ...prev,
            draftLink
        ]);
        setDraftLink("");
    }

    const validateInput = () => {
        const emptyLink = draftLink.trim() === "";
        const invalidUrl = !linkValidation(draftLink);

        if (emptyLink || invalidUrl){
            setLinkError(true);
            toast.error("Provide a valid url!")
            return false;
        }
        return true;
    }
    
    const resetDraftLinks = () => {
        setDraftLinks(content)
    }

    const handleDeleteLink = (linkIndex : number) => {
        setDraftLinks((prev) => 
            prev.filter((_, index) => index !== linkIndex));
    }

    return (
        <Dialog>
            <DialogTrigger asChild onClick={resetDraftLinks}>
                <div className="flex flex-row justify-between gap-x-1 hover:scale-110 hover:text-subtext">
                    <CirclePlus className="w-6 h-6 active:scale-90"/>
                    <p>Add Links</p>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add links</DialogTitle>
                    <DialogDescription>
                        Choose the website and add your url
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row w-full gap-1">
                    <Input
                        className={linkError
                            ? "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            : ""} 
                        type="link" 
                        placeholder="Add another link (discord, teams, etc.)" 
                        onChange={(e) => {setDraftLink(e.target.value); setLinkError(false)}} 
                        maxLength={300}
                        value={draftLink}
                        />
                    <Button variant="ghost" onClick={handleAddLink}>
                        <Plus />
                    </Button>
                </div>
                { draftLinks?.map((link, index) => (
                    <div className="flex flex-row w-full justify-start items-center" key={index}>
                        <Button variant="ghost" className="w-6 h-6 p-0" onClick={() => handleDeleteLink(index)}>
                            <Trash2 className="w-3 h-3 opacity-30" />
                        </Button>
                        <p className="text-ellipsis text-sm text-center opacity-50">{link}</p>
                    </div>
                ))}
                <Button onClick={updateLinks} className={loadingState ? "opacity-50 animate-pulse" : ""}>
                    <Save /> Save
                </Button>
                <DialogClose asChild>
                    <Button ref={closeRef} className="hidden" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}
