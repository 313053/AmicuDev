'use client'

import { ProjectCreationData } from "@/lib/types/projectTypes";
import { useState } from "react"
import PrimaryData from "./creation_stages/primaryData";
import SecondaryData from "./creation_stages/secondaryData";
import { TagData } from "@/lib/types/tagTypes";
import FinishLine from "./creation_stages/finishLine";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateProject() {
    const [ errorState, setErrorState ] = useState(false);
    const [ loadingState, setLoadingState ] = useState(false);
    const [ newId, setNewId ] = useState("0");
    const [ stage, setStage ] = useState(0);
    const [ draftProject, setDraftProject ] = useState<ProjectCreationData>({
        title : "",
        description : "",
        thumbnail : "",
        tags : [],
        github : ""
    });
    const { user: currentUser, isLoaded: isAuthLoaded } = useUser();
    const userId = useParams().id;
    const isCurrentUser = (isAuthLoaded && currentUser && currentUser.id === userId);

    const handleProgressPrimaryData = (title : string, description : string) => {
        console.log(title, description);
        setDraftProject((prev) => {
            return { ...prev, title, description }
        });
        setStage(1);
    }

    const handleProgressSecondaryData = async (tags : TagData[], github : string, thumbnail : string) => {
        setDraftProject((prev) => {
            return { ...prev, tags, github, thumbnail}
        })
        const finishedProject = {
            ...draftProject,
            tags,
            github,
            thumbnail
        }
        setLoadingState(true);
        setStage(2);
        await postProject(finishedProject);

    }

    const postProject = async (projectData : ProjectCreationData) => {
        try {
            const response = await fetch("/api/project/create-project", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(projectData)
            });

            if (!response.ok) {
                throw new Error(`Failed to post project data: ${response.status}`);
            }

            const result = await response.json();
            console.log("Project created:", result.data);
            setNewId(result.data.project.id);
            setLoadingState(false);
            setErrorState(false);
            console.log(result.data)
            return result.data;
        } catch (error) {
            console.error("Error creating project:", error);
            setLoadingState(false);
            setErrorState(true);
        }
    }

    if(!isAuthLoaded) {
        return (
            <div className="flex flex-col h-80 w-full justify-center items-center">
                <Loader2 className="animate-spin"/>
            </div>
        )
    }

    if(!isCurrentUser) {
        return (
            <div className="flex flex-col h-80 w-full justify-center items-center">
                <p className="text-xl text-center font-bold">User ID Mismatch: Access Denied</p>
            </div>
        )
    }

    switch (stage) {
        case 0 :
            return <PrimaryData 
                onProgress={(e) => handleProgressPrimaryData(e.title, e.description)}
                contents={{title : draftProject.title, description : draftProject.description}}/>
        case 1 :
            return <SecondaryData 
                onProgress={(e) => handleProgressSecondaryData(e.tags, e.github, e.thumbnail)}
                onRegress={() => setStage(0)}/>
        case 2 :
            return <FinishLine
                errorState={errorState}
                loadingState={loadingState}
                onRestart={() => setStage(0)}
                newId={newId}
                />
        default :
            return <PrimaryData 
                onProgress={(e) => handleProgressPrimaryData(e.title, e.description)}
                contents={{title : draftProject.title, description : draftProject.description}}/>
    }
}