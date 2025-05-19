'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Save, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProjectDescriptionProps {
    projectId: bigint;
    value: string;
}

export default function ProjectDescriptionEdit( { projectId, value } : ProjectDescriptionProps ) {
    const [ draftDescription, setDraftDescription ] = useState(value);
    const [ errorState, setErrorState ] = useState(false);
    const [ loadingState, setLoadingState ] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);

    const router = useRouter();


    const handleSaveDescription = async () => {
        setLoadingState(true);
        const validity = await validateInput();

        if(!validity) {
            setLoadingState(false);
            return;
        }

        const updateCall = await updateName();
        setLoadingState(false);

        if (!updateCall) {
            toast.error("Unable to update description. Try again later");
            return;
        }
        router.refresh();
        closeRef.current?.click();
    }

    const validateInput = async () => {
        const allowedPattern = /[^\p{L}0-9\s.,\-_'()!?]/u;

        if(!draftDescription.trim()) {
            setErrorState(true);
            toast.error("Enter a description!")
            return false;
        }
        if(draftDescription.length < 3) {
            setErrorState(true);
            toast.error("The description needs to be at least 3 characters!")
            return false;
        }
        if(allowedPattern.test(draftDescription)) {
            setErrorState(true);
            toast.error("The description can't contain special chacters!")
            return false;
        }
        return true;
    }

    async function updateName() {
        try {
            const res = await fetch(`/api/project/${projectId}/set-description`,{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ description : draftDescription })
            });
            if (!res.ok) {
                throw new Error("Failed to update project description");
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    } 

    return(
        <Dialog>
            <DialogTrigger asChild onClick={() => setDraftDescription(value)}>
                <button>
                    <SquarePen className="text-sidebar-foreground size-5 opacity-50 hover:scale-110" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:msx-w-xl">
                <DialogHeader>
                    <DialogTitle>Project Description</DialogTitle>
                    <DialogDescription>Choose a new project description</DialogDescription>
                </DialogHeader>
                <Textarea 
                    className={`resize-none h-auto min-h-56 overflow-visible ${errorState
                        && "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"}`}
                    placeholder="Describe your poject"
                    onChange={(e) => setDraftDescription(e.target.value)}
                    onMouseDown={() => setErrorState(false)}
                    maxLength={1000}
                    value={draftDescription}
                />
                <Button onClick={handleSaveDescription} className={loadingState ? "opacity-50 animate-pulse" : ""}>
                    <Save /> Save
                </Button>
                <DialogClose asChild>
                    <Button ref={closeRef} className="hidden" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}