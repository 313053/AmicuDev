import { skillLevels, TagData } from "@/lib/types/tagTypes";
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
    const [deletedTags, setDeletedTags] = useState<TagData[]>([]);

    return(
        <div className="flex flex-wrap gap-4 justify-start w-full">
            {content?.map((tag) => (
                <div key={tag.name} className={
                    `flex flex-row t w-fit border divide-x-2 rounded-lg items-center shadow-lg text-sm sm:text-base 
                    ${(tag.complexity > 1 && skillColors) ? `ring-4 ${skillLevels[tag.complexity-1].color}`: ``}` // Makes the object have a different ring based on the skill level
                    }>
                    <p className="p-2 bg-button text-background rounded-l-md text-center">{tag.name}</p>
                    <p className="p-2 bg-background text-foreground rounded-r-md">{skillLevels[tag.complexity-1].name}</p>
                </div>
            ))}
        </div>
    )
 }