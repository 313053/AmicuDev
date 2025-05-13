'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dot, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PrimaryDataProps {
  onProgress: ( value : { title: string; description: string }) => void;
  contents : {title : string; description : string};
}

export default function PrimaryData({ onProgress, contents } : PrimaryDataProps ) {
    const [ draftTitle, setDraftTitle ] = useState(contents.title);
    const [ draftDescription, setDraftDescription ] = useState(contents.description);
    const [ titleError, setTitleError ] = useState(false);
    const [ descriptionError, setDescriptionError ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const handleNext = async () => {
        if (!(await validateInputs()))
            return
        onProgress({title : draftTitle, description : draftDescription})
    }

    const validateInputs = async () => {
        const allowedPattern = /[^\p{L}0-9\s.,\-_'()!?]/u;
        let check = true;
        setLoading(true);
        const nameUniqueness = await checkNameUniqueness();

        if (!draftTitle.trim()) {
            setTitleError(true);
            toast.error("Enter a title!");
            check = false;
        }
        if (nameUniqueness === false) {
            setTitleError(true);
            toast.error("There already exists a project with that name!")
            check = false;
        }
        if (allowedPattern.test(draftTitle)){
            setTitleError(true);
            toast.error("Invalid title : avoid using special characters!");
            check = false;
        }
        if (draftTitle.length < 3){
            setTitleError(true);
            toast.error("Invalid title : it needs to be at least 3 characters long!");
            check = false;
        }
        if (!draftDescription.trim()) {
            setDescriptionError(true);
            toast.error("Enter a description!");
            check = false;
        }
        if (allowedPattern.test(draftDescription)){
            setDescriptionError(true);
            toast.error("Invalid description : avoid using special characters!");
            check = false;
        }
        if (draftDescription.length < 3){
            setDescriptionError(true);
            toast.error("Invalid description : it needs to be at least 3 characters long!");
            check = false;
        }
        setLoading(false);
        return check;
    }

    const checkNameUniqueness = async () => {
        try {
            const response = await fetch(`/api/project/check-project-name/${draftTitle}`)

            if (!response.ok) {
                throw new Error('Failed to check project name uniqueness');
            }

            const { data } = await response.json();
            return !data;
        } catch (error) {
            console.error('Error checking name uniqueness: ', error);
            return true;
        }
    }

    
    return(
        <Card className="flex flex-col justify-between h-fit min-h-96 w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row justify-center gap-x-2">
                        <Dot strokeWidth={4}/>
                        <Dot className="opacity-20"/>
                        <Dot className="opacity-20"/>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-y-4">
                <div className="flex flex-col h-fit w-full gap-y-2">
                    <Label>Project Name</Label>
                    <Input
                        className={titleError 
                            ? "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            : ""} 
                        type="text" 
                        placeholder="Enter the name of your project" 
                        onChange={(e) => {setDraftTitle(e.target.value); setTitleError(false)}} 
                        maxLength={50}
                        value={draftTitle}
                    />
                </div>
                <div className="flex flex-col h-fit w-full gap-y-2">
                    <Label>Description</Label>
                    <Textarea 
                        className={`resize-none h-fit min-h-56 overflow-visible ${descriptionError 
                            && "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"}`}  
                        placeholder="Describe your project"
                        onChange={(e) => {setDraftDescription(e.target.value); setDescriptionError(false)}}
                        maxLength={1000}
                        value={draftDescription}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-end gap-2">
                <LoaderCircle className={loading ? "animate-spin-slow" : "hidden"}/>
                <Button onClick={handleNext}>
                    Next
                </Button>
            </CardFooter>
        </Card>
    )
}