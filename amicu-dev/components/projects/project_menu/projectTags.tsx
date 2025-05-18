import Tags from "@/components/profile/tags/tags";
import { Skeleton } from "@/components/ui/skeleton";
import { TagData, TagPostProps } from "@/lib/types/tagTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectTagProps {
    projectId : bigint
    editable : boolean
}

export default function ProjectTags ({projectId, editable} : ProjectTagProps) {
    const [ isLoadingTags, setIsLoadingTags ] = useState(true);
    const [ projectTags, setProjectTags ] = useState<TagData[] | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchProjectTagData = async () => {
            if (!projectId) {
                return;
            }
            try {
                setIsLoadingTags(true);
                const response = await fetch(`/api/project/${projectId}/get-tags`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch tag data: ${response.status}`)
                }

                const payload = await response.json()
                const tagData : TagData[] = payload.data.map((item: TagData) => ({
                    name: item.name,
                    complexity: item.complexity
                }));
                setProjectTags(tagData);
                setIsLoadingTags(false);
            } catch (err) {
                console.error("Error fetching project tag data: ", err);
                setError(err instanceof Error ? err.message : "Unknown error occured");
                setIsLoadingTags(false);
            }
        }
        fetchProjectTagData();
    }, [projectId]);

    async function handleTagsChange({newTags, deletedTags}: TagPostProps) {
        try {
            const res = await fetch(`/api/project/${projectId}/set-tags`,{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ tags : newTags, badTags : deletedTags }),
            });
            if (!res.ok) {
                throw new Error("Failed to update tags");
            }
            router.refresh();
        } catch (err) {
            console.error(err);
        }
    }

    if (error) {
        return(
            <p className="text-xl">{error}</p>
        )
    }

    if (isLoadingTags) {
        return(
            <div className="flex flex-wrap gap-4 justify-start w-full">
                <Skeleton className="w-20 h-10 rounded-lg" />
                <Skeleton className="w-32 h-10 rounded-lg" />
                <Skeleton className="w-24 h-10 rounded-lg" />
                <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
        )
    }

    return (
        <Tags content={projectTags} editable={editable} onSave={handleTagsChange}/>
    )
}