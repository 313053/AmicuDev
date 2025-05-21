'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Save, SquarePen } from "lucide-react";
import { useRef, useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { linkValidation } from "@/lib/links";
import { checkGithub } from "../my_projects/creation_stages/secondaryData";

interface ProjectRepoProps {
    projectId: bigint;
    value: string;
    noRepo: boolean;
}

export default function ProjectRepoEdit( { projectId, value, noRepo } : ProjectRepoProps ) {
    const [ draftRepo, setDraftRepo ] = useState(value);
    const [ errorState, setErrorState ] = useState(false);
    const [ loadingState, setLoadingState ] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);

    const router = useRouter();


    const handleSaveRepo = async () => {
        setLoadingState(true);
        const validity = await validateInput();

        if(!validity) {
            setLoadingState(false);
            return;
        }

        const updateCall = await updateLink();
        setLoadingState(false);

        if (!updateCall) {
            toast.error("Unable to update repo link. Try again later");
            return;
        }
        router.refresh();
        closeRef.current?.click();
    }

    const validateInput = async () => {

        if(draftRepo.trim() === "") {
            return true;
        }
        if(draftRepo.length < 3) {
            setErrorState(true);
            toast.error("The link needs to be at least 3 characters!");
            return false;
        }
        if(!linkValidation(draftRepo)) {
            setErrorState(true);
            toast.error("Provide a valid Github url!");
            return false;
        }
        if(!checkGithub(draftRepo)) {
            setErrorState(true);
            toast.error("Github repo not found!");
            return false;
        }
        return true;
    }

    async function updateLink() {
        try {
            const res = await fetch(`/api/project/${projectId}/set-github`,{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ repoLink : draftRepo })
            });
            if (!res.ok) {
                throw new Error("Failed to update project repo");
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    } 

    return(
        <Dialog>
            <DialogTrigger asChild onClick={() => setDraftRepo(value)}>
                <button className={`content-center h-full ${noRepo && "w-full"}`}>
                    { noRepo 
                        ? (
                            <div className="flex flex-row w-full h-full items-start justify-center mt-6 ">
                                <p className="text-lg font-semibold p-4 bg-button rounded-xl text-primary-foreground w-fit">Connect to GitHub</p>
                            </div>
                        ) : (
                            <SquarePen className="text-sidebar-foreground size-5 opacity-50 hover:scale-110" />
                        )}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Github Repo</DialogTitle>
                    <DialogDescription>Paste the url to the desired repository</DialogDescription>
                </DialogHeader>
                <Input 
                    type="text"
                    value={draftRepo}
                    onChange={(e) => setDraftRepo(e.target.value)}
                    onMouseDown={() => setErrorState(false)}
                    className={errorState ? "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" : ""}
                />
                <Button onClick={handleSaveRepo} className={loadingState ? "opacity-50 animate-pulse" : ""}>
                    <Save /> Save
                </Button>
                <DialogClose asChild>
                    <Button ref={closeRef} className="hidden" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}