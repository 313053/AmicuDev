import { skillLevels, TagData } from "@/lib/types/tagTypes";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

interface TagProps {
    content : TagData[] | null
    editable : boolean
    onSave : void
}

// Variable deciding whether different skill levels have a cheesy outline around them
const skillColors = false;

export default function UserTags( {content, editable, onSave} : TagProps){
    const [draftTags, setDraftTags] = useState(content);
    const [displayedTags, setDisplayedTags] = useState(content);
    const [deletedTags, setDeletedTags] = useState<TagData[]>([]);

    return(
        <div className="flex flex-wrap gap-4 justify-start w-full">
            {displayedTags?.map((tag) => (
                <div key={tag.name} className={
                    `flex flex-row t w-fit border divide-x-2 rounded-lg items-center shadow-lg text-sm sm:text-base 
                    ${(tag.complexity > 1 && skillColors) ? `ring-4 ${skillLevels[tag.complexity-1].color}`: ``}` // Makes the object have a different ring based on the skill level
                    }>
                    <p className="p-2 bg-button text-background rounded-l-md text-center">{tag.name}</p>
                    <p className="p-2 bg-background text-foreground rounded-r-md">{skillLevels[tag.complexity-1].name}</p>
                </div>
            ))}
            {editable && (
                <Dialog>
                    <DialogTrigger>
                        <div className="p-2 rounded-xl bg-button shadow-lg hover:scale-110">
                            <Plus className="text-background"/>
                        </div>
                    </DialogTrigger>
                </Dialog>
            )}
        </div>
    )
 }