'use client'

import { SuggestedProject } from "@/lib/types/projectTypes"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { skillLevels } from "@/lib/types/tagTypes";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Clock } from "lucide-react";

interface SuggestedProjectCardProps {
    suggestedProject: SuggestedProject
}

export default function ExplorePage() {
    const [ projects, setProjects ] = useState<SuggestedProject[] | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(1);
    const [ hasMore, setHasMore ] = useState(true);
    const observerRef = useRef<HTMLDivElement | null>(null);

    // Fetching suggestions either without parameters (for initial load)
    // or with pagination specifications for infinite scroll
    const fetchSuggestions = useCallback(async () =>{
        if( loading || !hasMore)
            return;
        setLoading(true);
        try {

            const response = await fetch(`/api/project/explore?page=${page}&limit=3`)

            if (!response.ok)
                throw new Error(`Failed to fetch user data: ${response.status}`);

            const payload = await response.json();
            setPage(payload.currentPage + 1);
            setHasMore(payload.hasMore);
            setProjects((prev) => [
                ...prev || [],
                ...payload.data
            ]);
        } catch (error) {
            console.error("Error fetching project suggestions: ", error);
            toast.error("Couldn't load projects! Try again later");
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading]);


    // Infinite scroll functionality. It sets up an IntersectionObserver that checks for when the
    // invisible div at the end comes into view and fetches new data. 
    useEffect(() => {
        const observer = new IntersectionObserver(
            (observed) => {
                if (observed[0].isIntersecting) {
                    fetchSuggestions();
                }
            },
            {
                threshold: 1.0
            }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [ fetchSuggestions ]);



    return(
        <div className="flex flex-col items-center gap-y-10">
            { projects?.map((project, index) => (
                <SuggestedProjectCard suggestedProject={project} key={index}/>
            )) }
            { loading && Array.from({ length: 3}).map((_, index) =>
                <div className="flex flex-col w-full max-w-xl gap-2" key={index}>
                    <Skeleton className="w-full h-16" />
                    <Skeleton className="w-full h-64" />
                </div>
            )}
            <div ref={observerRef} className="mt-10 h-1" />
        </div>
    )
}

function SuggestedProjectCard( { suggestedProject } : SuggestedProjectCardProps ) {
    const project = suggestedProject.project;
    const projectUrl = `/project/${project.id}`;
    return (
        <Card className="w-full max-w-xl">
            <CardContent>
                <div className="flex flex-col h-auto z-10 gap-6 sm:gap-8 py-4">
                    <div className="grid grid-cols-4 gap-1">
                        <div className="col-span-1 justify-self-center content-center">
                            <Link href={projectUrl}>
                                <Avatar className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-card-textArea hover:opacity-70">
                                    <AvatarImage src={project.thumbnail} alt="thumbnail" />
                                    <AvatarFallback className="w-full h-full bg-card-textArea">
                                        <p className="text-3xl font-bold">
                                            {project.title[0].toUpperCase()}
                                        </p>
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                        <div className="col-span-3 justify-self-center content-center">
                            <Link href={projectUrl}>
                                <p className="text-xl sm:text-3xl font-semibold line-clamp-2 hover:opacity-70" title={project.title}>
                                    {project.title}
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full">
                        <Link href={projectUrl}>
                            <Button className="w-full">
                                Visit Project
                            </Button>
                        </Link>
                    </div>
                    <div className="w-full min-h-20  bg-card-textArea rounded-sm p-4">
                        <p className="text-sm sm:text-md font-semibold line-clamp-4" title={project.description}>
                            {project.description}
                        </p>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                        { project.tags.map((tag, index) => (
                            <div key={index} className="flex flex-row border rounded-lg text-xs sm:text-sm text-center">
                                <p className="bg-button text-background rounded-l-md p-1">
                                    {tag.name}
                                </p>
                                <div className="border-r" />
                                <p className="p-1">
                                    {skillLevels[tag.complexity-1].name}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <span className="flex flex-row gap-2 text-subtext text-sm items-center">
                            <Clock className="size-4"/> Created: {new Date(project.createdAt).toDateString()}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}