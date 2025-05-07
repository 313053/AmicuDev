import { skillLevels, TagData, TagPostProps } from "@/lib/types/tagTypes";
import { Plus, Save, SquarePen, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "../../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select";
import { TagInput } from "./tagInput";
import { toast } from "sonner";

interface TagProps {
    content: TagData[] | null
    editable: boolean
    onSave: ({newTags, deletedTags} : TagPostProps) => void 
}

interface TagFormProps {
    data: TagData
    index: number 
}

// Variable deciding whether different skill levels have a cheesy outline around them
const skillColors = false;

export default function UserTags({ content, editable, onSave }: TagProps) {
    const [draftTags, setDraftTags] = useState(content);
    const [displayedTags, setDisplayedTags] = useState(content);
    const [deletedTags, setDeletedTags] = useState<TagData[]>([]);
    const [emptyTagList, setEmptyTagList] = useState(true);

    useEffect(() => {
        if (content && content.length > 0) {
          setDisplayedTags(content);
          setDraftTags(content);
        }
    }, [content]);

    useEffect(() => {
        if (displayedTags && displayedTags.length > 0) {
            setEmptyTagList(false);
            return;
        }
        setEmptyTagList(true);
    }, [displayedTags]);

    const handleAddTag = () => {
        setDraftTags(prev => {
            const newTag: TagData = { name: "", complexity: 0 };
            return (prev) 
                ? [...prev, newTag]
                : [newTag];
        });
    };

    const handleResetTags = () => {
        setDraftTags(displayedTags);
        setDeletedTags([]);
    };

    const handleSaveTags = () => {
        const validTags = draftTags?.filter(tag => 
            tag.name.trim() !== "" && tag.complexity > 0
        ) || [];
        
        setDisplayedTags(validTags);
        
        if (onSave) {
            onSave({newTags : validTags , deletedTags : deletedTags});
        }
    };

    return (
        <div className="flex flex-wrap gap-4 justify-start w-full">
            {displayedTags?.map((tag) => (
                <div key={tag.name} className={
                    `flex flex-row t w-fit border divide-x-2 rounded-lg items-center shadow-lg text-sm sm:text-base 
                    ${(tag.complexity > 1 && skillColors) ? `ring-4 ${skillLevels[tag.complexity-1].color}`: ``}` // Makes the object have a different ring based on the skill level
                    }>
                    <p className="p-2 bg-button text-background rounded-l-md text-center">{tag.name}</p>
                    <p className="p-2 bg-background text-foreground rounded-r-md">
                        {tag.complexity > 0 && tag.complexity <= skillLevels.length ? 
                            skillLevels[tag.complexity-1].name : 'Unknown'}
                    </p>
                </div>
            ))}
            {editable && (
                <Dialog>
                    <DialogTrigger onClick={handleResetTags}>
                        <div className={`p-2 rounded-xl bg-button shadow-lg hover:scale-110 ${emptyTagList && "animate-pulse flex flex-row items-center scale-95 hover:scale-100"}`}>
                            <Plus className="text-background"/>
                            {emptyTagList && (
                                <p className="text-lg text-background">Add your skills</p>
                            )}
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Add Skills</DialogTitle>
                            <DialogDescription>
                                Write the skill and your level
                            </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-visible py-2">
                            {draftTags?.map((tag, index) => (
                                <TagForm key={`tag-form-${index}`} data={tag} index={index} />
                            ))}
                        </div>
                            <Button variant="ghost" onClick={handleAddTag}>
                                <Plus /> Add New Skill
                            </Button>
                            <DialogClose asChild>
                                <Button onClick={handleSaveTags}>
                                    <Save className="mr-2" /> Save
                                </Button>
                            </DialogClose>
                    </DialogContent>
                </Dialog>
            )}
            {!editable && emptyTagList && (
                <p className="text-lg text-subtext">This user has yet to list their skills.</p>
            )}
        </div>
    );

    function TagForm({ data, index }: TagFormProps) {
        const isNewTag = (!data || (data.name === "" && data.complexity === 0));
        const [draftTag, setDraftTag] = useState(data || { name: "", complexity: 0 });
        const [tagEditing, setTagEditing] = useState(isNewTag);
        const [nameErrorState, setNameErrorState] = useState(false);
        const [levelErrorState, setLevelErrorState] = useState(false);

        const handleTagFormSave = () => {
            const nameValidity = draftTag.name.trim() !== "";
            const complexityValidity = draftTag.complexity > 0; 
            const nameRepetition = draftTags?.some( tag => tag.name.toLowerCase().trim() === draftTag.name.toLowerCase().trim()) && isNewTag
            let saveStopper = false;
            if(!nameValidity){
                toast.error("Skill name required!");
                setNameErrorState(true);
                saveStopper = true;
            }
            if(nameRepetition){
                toast.error("Names cannot repeat!");
                setNameErrorState(true);
                saveStopper = true;
            }
            if(!complexityValidity){
                toast.error("Choose a valid skill level");
                setLevelErrorState(true);
                saveStopper = true;
            }

            if(saveStopper) {
                saveStopper = false;
                return
            }
            
            setNameErrorState(true);

            setDraftTags(prev => {
                return (prev)
                    ? prev.map((tag, i) => (i === index ? draftTag : tag))
                    : [draftTag];
            });
            setTagEditing(false);
        };

        const handleCancel = () => {
            if (isNewTag) {
                handleDelete();
                return;
            }
            setDraftTag(data);
            setTagEditing(false);
            setNameErrorState(false);
            setLevelErrorState(false);
        };

        const handleDelete = () => {
            setDraftTags(prev => {
                return (prev) 
                    ? prev.filter((_, i) => i !== index)
                    : null;
            });
            
            if (!isNewTag) {
                setDeletedTags(prev => {
                    return (prev)
                        ? [...prev, draftTag]
                        : [draftTag];
                });
            }
        };

        return (
            <div className="flex flex-row justify-around gap-x-2 items-center mb-4">
                <Trash2 className="min-w-4 min-h-4 sm:w-5 sm:h-5 hover:scale-110" onClick={handleDelete}/>
                <div className="flex-grow relative">
                    <TagInput
                        disabled={!tagEditing}
                        value={draftTag.name}
                        onChange={(e) =>{
                            setDraftTag(prev => ({
                                ...prev,
                                name: e
                            }))
                            setNameErrorState(false);
                            }
                        }
                        placeholder="Choose new or existing skill"
                        errorState={nameErrorState}
                    />
                </div>
                <div className="w-36">
                    <Select
                        disabled={!tagEditing}
                        onValueChange={(e) => {
                            const comp = skillLevels.findIndex(item => item.name === e) + 1;
                            setDraftTag(prev => ({
                                ...prev,
                                complexity: comp 
                            }));
                            setLevelErrorState(false);
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
                </div>
                <div className="flex-shrink-0">
                    {tagEditing ? (
                        <div className="flex flex-row gap-1">
                            <Button onClick={handleTagFormSave} type="button" size="sm">
                                <Save className="w-4 h-4" />
                            </Button>
                            <Button onClick={handleCancel} variant="outline" size="sm" className="px-2">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={() => setTagEditing(true)} variant="ghost" size="sm">
                            <SquarePen className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}