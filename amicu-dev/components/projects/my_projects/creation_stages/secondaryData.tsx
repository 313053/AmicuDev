'use client'

import { TagInput } from "@/components/profile/tags/tagInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { imageLinkValidation, linkValidation } from "@/lib/links";
import { skillLevels, TagData } from "@/lib/types/tagTypes";
import { Dot, Plus, Trash2} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SecondaryDataProps {
  onProgress : ( value : { tags : TagData[]; github : string; thumbnail : string }) => void;
  onRegress : () => void;
}

export default function SecondaryData({ onProgress, onRegress } : SecondaryDataProps ) {
    const [ draftGithub, setDraftGithub ] = useState("");
    const [ draftThumbnail, setDraftThumbnail ] = useState("");
    const [ draftTags, setDraftTags ] = useState<TagData[]>([]);
    const [ githubError, setGithubError ] = useState(false);
    const [ thumbnailError, setThumbnailError ] = useState(false);

    const handlePrevious = () => {
        onRegress();
    }


    const handleDeleteTag = (index : number) => {
        setDraftTags((prev) => prev.filter((_, i) => i !== index));
    }

    const validateInputs = async () => {
        let check = true;
        const githubLinkValidation = draftGithub.trim() === "" 
            ? true 
            : linkValidation(draftGithub);
        const thumbnailValidation = draftThumbnail.trim() === ""
            ? true
            : await imageLinkValidation(draftThumbnail);
        const githubRepoValidation = draftGithub.trim() === "" || !githubLinkValidation
            ? true
            : await checkGithub();
        const tagValidation = draftTags.length > 0;

        if (!githubLinkValidation) {
            setGithubError(true);
            toast.error("Provide a valid GitHub url!");
            check = false;
        }
        else if (!githubRepoValidation) {
            setGithubError(true);
            toast.error("Github repo not found!");
            check = false;
        }
        if (!thumbnailValidation) {
            setThumbnailError(true);
            toast.error("Provide a valid image url!");
            check = false;
        }
        if (!tagValidation) {
            toast.error("At least 1 tag required!");
            check = false;
        }
        return check;
    }

    const checkGithub = async () => {
        try {
            const url = new URL(draftGithub);
            const [ owner, repo ] = url.pathname.slice(1).split('/');

            if (!owner || !repo)
                return false;

            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

            return response.ok
        } catch {
            return false;
        }
    }

    const handleFinish = async () => {
        const validation = await validateInputs();

        if (!validation) 
            return;
        onProgress({ tags : draftTags, github : draftGithub, thumbnail : draftThumbnail })
    }
    
    return(
        <Card className="flex flex-col justify-between h-fit min-h-96 w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row justify-center gap-x-2">
                        <Dot className="opacity-20"/>
                        <Dot strokeWidth={4}/>
                        <Dot className="opacity-20"/>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-y-4">
                <div className="flex flex-col h-fit w-full gap-y-2">
                    <Label>Github Repository &#40;Optional&#41;</Label>
                    <Input
                        className={githubError 
                            ? "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            : ""} 
                        type="link" 
                        placeholder="Link the github repo of your project" 
                        onChange={(e) => {setDraftGithub(e.target.value); setGithubError(false)}} 
                        maxLength={200}
                        value={draftGithub}
                        />
                </div>
                <div className="flex flex-col h-fit w-full gap-y-2">
                    <Label>Thumbnail Link &#40;Optional&#41;</Label>
                    <Input
                        className={thumbnailError 
                            ? "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            : ""} 
                        type="link" 
                        placeholder="Link an image representing your project" 
                        onChange={(e) => {setDraftThumbnail(e.target.value); setThumbnailError(false)}} 
                        maxLength={200}
                        value={draftThumbnail}
                        />
                </div>
                <AddTag />
                <div className="flex flex-wrap justify-start content-start w-full gap-2">
                    { draftTags?.map((tag, index) => (
                        <div className="flex flex-row items-center" key={index}>
                            <Trash2 className="w-4 h-4 opacity-30 rounded-lg hover:scale-110" onClick={() => handleDeleteTag(index)}/> 
                            <div className="flex flex-row border border-border rounded-lg">
                                <p className="bg-button text-background text-sm rounded-l-md text-center p-1">{tag.name}</p>
                                <div className="border-r"/>
                                <p className="text-sm text-center p-1">{skillLevels[tag.complexity-1].name}</p>
                            </div>
                        </div>
                    )) }
                </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-end gap-x-2">
                <Button onClick={handlePrevious} variant="outline">
                    Previous
                </Button>
                <Button onClick={handleFinish}>
                    Finish
                </Button>
            </CardFooter>
        </Card>
    )

    function AddTag() {
        const [ draftTag, setDraftTag ] = useState<TagData>({name : "", complexity : 0});
        const [ nameErrorState, setNameErrorState ] = useState(false);
        const [ levelErrorState, setLevelErrorState ] = useState(false);

        const validateTag = () => {
            const nameValidity = draftTag.name.trim() !== "";
            const complexityValidity = draftTag.complexity > 0; 
            const nameRepetition = draftTags.some(tag => tag.name.toLowerCase().trim() === draftTag.name.toLowerCase().trim());
            let tagCheck = true;

            if(!nameValidity) {
                setNameErrorState(true);
                toast.error("Tag name required!");
                tagCheck = false;
            }
            if(nameRepetition) {
                setNameErrorState(true);
                toast.error("Tags can't repeat!");
                tagCheck = false;
            }
            if(!complexityValidity) {
                setLevelErrorState(true);
                toast.error("Choose a valid tag level");
                tagCheck = false;
            }
            return tagCheck;
        }

        const handleAddTag = () => {
            if(!validateTag())
                return;
            setDraftTags((prev) => ([
                ...prev,
                draftTag
            ]))
        }

        return(
            <div className={`flex flex-col h-fit w-full gap-y-2`}>
                <Label>Tags</Label>
                <div className="flex flex-row w-full gap-x-1">
                    <TagInput 
                        value={draftTag.name} 
                        onChange={(e) => {
                            setDraftTag((prev) => ({
                                ...prev,
                                name : e
                            }));
                        }}
                        errorState={nameErrorState} 
                    />
                    <Select
                        onValueChange={(e) => {
                            const comp = skillLevels.findIndex(item => item.name === e) + 1;
                            setDraftTag(prev => ({
                                ...prev,
                                complexity: comp 
                            }));
                        }}
                        value={draftTag.complexity !== 0 ? skillLevels[draftTag.complexity-1].name : ""}
                    >
                        <SelectTrigger className={`w-full bg-card disabled:bg-background shadow-lg ${levelErrorState && "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"}`}>
                            <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Skill Level</SelectLabel>
                                {skillLevels.map((level, i) => (
                                    <SelectItem key={i} value={level.name}>{level.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" onClick={handleAddTag}>
                        <Plus/>
                    </Button>
                </div>
            </div>
        )
    }
}