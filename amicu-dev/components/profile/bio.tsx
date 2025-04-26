import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SquarePen, X } from "lucide-react";

interface BioProps {
    content : string;
    editable : boolean;
    onSave : (newBio : string) => Promise<void> | void;
}

export default function UserBio( {content, editable, onSave} : BioProps ){
    const noBio = (content.trim() === "");
    const [editing, setEditing] = useState(false);
    const [draftBio, setDraftBio] = useState(content);

    const handleSave = async () => {
        await onSave(draftBio);
        setEditing(false);
    }

    const handleCancel = async () => {
        setDraftBio(content);
        setEditing(false);
    }

    return(
        <div className="relative w-full sm:h-72 h-full rounded-md p-4 bg-card-textArea ">
            <p className="font-bold pb-2">About</p>
            { editing ? (
                <div className="space-y-5 h-full pb-8">
                    <Textarea 
                        className="w-full h-full resize-none bg-card-textArea border-none"
                        value={draftBio}
                        onChange={(e) => setDraftBio(e.target.value)}
                        maxLength={500}/>
                    <Button className="h-6 w-[calc(100%+32px)] -ml-4" onClick={handleSave}>
                        Save
                    </Button>
                    <X className="absolute -top-1 right-4 h-6 w-6 p-1 bg-card rounded-xl" onClick={handleCancel} strokeWidth={3} />
                </div>
            ) : noBio ? (
                editable ? (
                    <p 
                        className="italic text-muted-foreground w-full h-5/6"
                        onClick={ () => setEditing(true)}
                    >
                        Say something about yourself
                    </p>
                ) : (
                    <p className="italic text-muted-foreground">This user has yet to tell us something about themselves</p>
                )
            ) : (
                <div>
                    <p>{draftBio}</p>
                    {editable && (
                        <SquarePen className="absolute top-[18px] left-[68px] h-5 w-5" onClick={ () => setEditing(true)}/>
                    )}
                </div>
            )}
        </div>
    )
}