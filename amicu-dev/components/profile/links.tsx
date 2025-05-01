import { allowedIcons, linkValidation } from "@/lib/links";
import { UserLink } from "@/lib/types/profileTypes";
import { CirclePlus, Plus, Save, SquarePen, Trash2, X} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectGroup} from "../ui/select";
import { toast } from "sonner";

interface LinkProps {
    content : UserLink[] | null
    editable : boolean
    onSave :  (newLinks : UserLink[]) => (Promise<void>)
}

interface LinkFormProps {
    data : UserLink
    index : number
}


export default function UserLinks( {content, editable, onSave} : LinkProps) {
    const [draftLinks, setDraftLinks] = useState(content);
    const [displayedLinks, setDisplayedLinks] = useState(content);
    
    const handleSave = async () => {
        if(draftLinks) {
            const cleanedLinks = removeEmptyLinks();
            if(cleanedLinks !== content)
                await onSave(cleanedLinks);
            setDisplayedLinks(cleanedLinks)
        }

    }

    // list of favicons to represent user links with
    // placeholders for unsupported hostnames
    const linkIcons : string[] = displayedLinks?.map(link => (
        allowedIcons.includes(link.name.toLowerCase())
            ? `https://${link.name.toLowerCase()}/favicon.ico`
            : '/globe.svg'
    )) || []; 

    const resetDraftLinks = () => {
        setDraftLinks(content)
    }

    const addLink = () => {
        setDraftLinks(prev => {
            const newLink: UserLink = {name: "", url: ""}
            return (prev) 
                ? [...prev, newLink]
                : [newLink]
        })
    }

    const removeEmptyLinks = () => {
        return draftLinks?.filter(link => link.name !== '') || []
    }

    return(
        <div>
            <div className="flex flex-row w-full justify-stretch align-middle mt-2 gap-x-1">
            {displayedLinks?.map((link, index) => (
                <a key={index} href={link.url} title={new URL(link.url).hostname} target="_blank" rel="noopener noreferrer">
                    <Image 
                        src={linkIcons[index] || '/globe.svg'} 
                        alt="" 
                        width={24} 
                        height={24} 
                        className="hover:scale-110"/>
                </a>
            ))}
            {editable && (
                <Dialog>
                    <DialogTrigger asChild onClick={resetDraftLinks}>
                        <div className="flex flex-row justify-between gap-x-2 hover:scale-110 hover:text-subtext">
                            <CirclePlus className="w-6 h-6"/>
                            {linkIcons.length === 0 && (
                                <p>Add Links</p>
                            )}
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Add links</DialogTitle>
                            <DialogDescription>
                                Choose the website and add your url
                            </DialogDescription>
                        </DialogHeader>
                        {draftLinks?.map((link, index) => (
                            <LinkForm data={link} index={index} key={index}/>
                        ))}
                        <Button variant="ghost" onClick={addLink}>
                            <Plus />
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleSave}>
                                <Save /> Save
                            </Button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            )}
            </div>
        </div>
    )

    function LinkForm({data, index} : LinkFormProps) {
        const containsData = (data && data.name !== "" && data.url !== "")
        const [draftLink, setDraftLink] = useState(
            containsData
                ? data
                : { name : "", url : "" }
        )
        const [linkEditing, setLinkEditing] = useState(!containsData)
        const [errorState, setErrorState] = useState(false)
    
        const handleLinkFormSave = () => {
            if(!linkValidation(draftLink.url)) {
                setErrorState(true)
                toast.error("Please input a valid link!")
                return
            }
            if(draftLink.name !== `${new URL(draftLink.url).hostname.replace(/^www\./, '')}` && draftLink.name !== "other"){
                setErrorState(true)
                toast.error("Make sure the domain matches the link!")
                return
            }
            setDraftLinks(prev => {
                return (prev) 
                    ? prev.map((link, i) => (i === index ? draftLink : link))
                    : [draftLink]
            })
            setLinkEditing(false)
        }

        const handleCancel = () => {
            if (!containsData){
                handleDelete()
                return
            }
            setDraftLink(data)
            setLinkEditing(false)
        }

        const handleDelete = () => {
            setDraftLinks(prev => {
              return (prev) 
                ? prev.filter((_, i) => i !== index)
                : null
            });
        };
          
    
        return(
        <div className="flex flex-row justify-around gap-x-2 items-center">
            <Trash2 className="w-7 h-7 hover:scale-110" onClick={handleDelete}/>
            <Select 
                disabled={!linkEditing} 
                onValueChange={(e) =>
                    setDraftLink(prev => ({
                        ...prev,
                        name: e
                    }))
                }
                value={((allowedIcons.includes(draftLink.name.toLowerCase()) || draftLink.name === "")
                    ? draftLink.name.toLowerCase() 
                    : "other")
                    }>
                <SelectTrigger className="w-36" onClick={() =>setLinkEditing(true)}>
                    <SelectValue placeholder="Select Domain..."/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Domain</SelectLabel>
                        {allowedIcons.map((domain, i) => (
                            <SelectItem key={i} value={domain}>{domain.split('.')[0]}</SelectItem>
                        ))}
                        <SelectItem value="other">other</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Input
                type="url"
                disabled={!linkEditing}
                onChange={(e) =>
                    setDraftLink(prev => ({
                        ...prev,
                        url : e.target.value
                    }))
                }
                value={draftLink.url}
                placeholder="link to website"
                onMouseDown={() =>setLinkEditing(true)}
                className={errorState ? "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" : ''}
                >
            </Input>
            {linkEditing 
                ? (
                    <div className="flex flex-row justify-evenly gap-1">
                        <Button onClick={handleLinkFormSave}>
                            <Save />
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="px-2">
                            <X />
                        </Button>
                    </div>
                ) : (
                    <Button onClick={() => setLinkEditing(true)} variant="ghost">
                    <SquarePen />
                    </Button>
                )
            }
        </div>
        )
    }
}

