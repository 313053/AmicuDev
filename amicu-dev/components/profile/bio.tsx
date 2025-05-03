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
    const [noBio, setNoBio] = useState(content.trim() === "");
    const [editing, setEditing] = useState(false);
    const [draftBio, setDraftBio] = useState(content);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        await onSave(draftBio);
        setLoading(false);
        setNoBio(draftBio.trim() === "")
        setEditing(false);
    }

    const handleCancel = async () => {
        setDraftBio(content);
        setEditing(false);
    }

    return(
        <div className={`relative w-full min-h-48 h-fit rounded-md p-4 bg-card-textArea text-wrap `}>
            <p className="font-bold pb-2">About</p>
            { editing ? (
                <div className="space-y-5 h-full pb-8">
                    <Textarea 
                        className={`w-full h-full resize-none bg-card-textArea border-none ${loading && "blur-sm animate-pulse"}`}
                        value={draftBio}
                        onChange={(e) => setDraftBio(e.target.value)}
                        maxLength={700}/>
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
                    <p className="whitespace-pre-line">{draftBio}</p>
                    {editable && (
                        <SquarePen className="absolute top-[18px] left-[68px] h-5 w-5 hover:scale-110 hover:text-subtext" onClick={ () => setEditing(true)}/>
                    )}
                </div>
            )}
        </div>
    )
}