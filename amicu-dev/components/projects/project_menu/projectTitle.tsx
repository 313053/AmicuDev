'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Save, SquarePen } from "lucide-react";
import { useRef, useState } from "react";
import { checkNameUniqueness } from "../my_projects/creation_stages/primaryData";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProjectTitleProps {
    projectId: bigint;
    value: string
}

export default function ProjectTitleEdit( { projectId, value } : ProjectTitleProps ) {
    const [ draftTitle, setDraftTitle ] = useState(value);
    const [ errorState, setErrorState ] = useState(false);
    const [ loadingState, setLoadingState ] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);

    const router = useRouter();


    const handleSaveTitle = async () => {
        setLoadingState(true);
        const validity = await validateInput();

        if(!validity) {
            setLoadingState(false);
            return;
        }

        const updateCall = await updateName();
        setLoadingState(false);

        if (!updateCall) {
            toast.error("Unable to update name. Try again later");
            return;
        }
        router.refresh();
        closeRef.current?.click();
    }

    const validateInput = async () => {
        const nameUniqueness = await checkNameUniqueness(draftTitle);
        const allowedPattern = /[^\p{L}0-9\s.,\-_'()!?]/u;

        if(!draftTitle.trim()) {
            setErrorState(true);
            toast.error("Enter a title!")
            return false;
        }
        if(draftTitle.length < 3) {
            setErrorState(true);
            toast.error("The name needs to be at least 3 characters!")
            return false;
        }
        if(allowedPattern.test(draftTitle)) {
            setErrorState(true);
            toast.error("The name can't contain special chacters!")
            return false;
        }
        if(!nameUniqueness) {
            setErrorState(true);
            toast.error("The name needs to be unique!")
            return false;
        }
        return true;
    }

    async function updateName() {
        try {
            const res = await fetch(`/api/project/${projectId}/set-title`,{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ title : draftTitle })
            });
            if (!res.ok) {
                throw new Error("Failed to update project name");
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    } 

    return(
        <Dialog>
            <DialogTrigger asChild onClick={() => setDraftTitle(value)}>
                <button>
                    <SquarePen className="text-sidebar-foreground size-5 opacity-50 hover:scale-110" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:msx-w-xl">
                <DialogHeader>
                    <DialogTitle>Project Name</DialogTitle>
                    <DialogDescription>Choose a new, unique project name</DialogDescription>
                </DialogHeader>
                <Input 
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onMouseDown={() => setErrorState(false)}
                    className={errorState ? "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" : ""}
                />
                <Button onClick={handleSaveTitle} className={loadingState ? "opacity-50 animate-pulse" : ""}>
                    <Save /> Save
                </Button>
                <DialogClose asChild>
                    <Button ref={closeRef} className="hidden" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}