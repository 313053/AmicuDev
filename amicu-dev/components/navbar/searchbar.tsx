'use client'

import { Input } from "../ui/input";
import { Folder, Search, User} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useRef, useState } from "react";
import { SearchType } from "@/lib/types/extraTypes";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@clerk/nextjs";

interface SearchSuggestionCardProps {
    content: SearchType
} 

export function Searchbar(){
    const [ suggestions, setSuggestions ] = useState<SearchType[] | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ popoverOpen, setPopoverOpen ] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null); 
    const containerRef = useRef<HTMLDivElement>(null);
    const { isSignedIn } = useUser();

    // Troubleshooting: makes the input active when you activate the popover
    useEffect(() => {
        if (popoverOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [popoverOpen]);

    const fetchSuggestions = (query: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!query || query.length < 2) {
            setSuggestions([]);
            setLoading(false);
        }

        setLoading(true);
        debounceTimerRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch search suggestions: ${response.status}`);
                }

                const payload = await response.json();
                setSuggestions(payload.data);
            } catch (error) {
                console.error('Error fetching search suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const renderSuggestions = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-4 grid-rows-2 w-full">
                    <div className="col-span-1 row-span-2 justify-self-center">
                        <Skeleton className="w-14 h-14 rounded-xl" />
                    </div>
                    <div className="justify-self-start row-span-1 col-span-3 content-end">
                        <Skeleton className="w-44 h-5" />
                    </div>
                    <div className="justify-self-start row-span-1 col-span-3 content-center">
                        <Skeleton className="w-28 h-4"/>
                    </div>
                </div>
            )
        }
        return suggestions?.map((suggestion, index) => (
            <SearchSuggestionCard content={suggestion} key={index}/>
        ))
    }

    if (!isSignedIn) {
        return(
            <div className="flex size-fit max-w-sm items-start justify-self-center space-x-2 w-1/3 sm:w-full relative -translate-x-2 sm:-translate-x-0">
                <Input 
                    type="text" 
                    placeholder="Search" 
                    className="pl-10 border-navbar-primary text-white placeholder:text-navbar-primary placeholder:opacity-80"
                    />
                <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-navbar-primary opacity-80" />
            </div>   
        ) 
    }

    return(
        <div
            ref={containerRef}
            onFocus={() => setPopoverOpen(true)}
            onBlur={(e) => {
                if (!containerRef.current?.contains(e.relatedTarget)) {
                    setPopoverOpen(false);
                }
            }}
            className="w-1/3 sm:w-full"
        >
            <Popover open={popoverOpen}>
                <PopoverTrigger asChild>
                    <div className="flex size-fit max-w-sm items-start justify-self-center space-x-2 w-full relative -translate-x-2 sm:-translate-x-0">
                        <Input 
                            ref={inputRef}
                            onChange={(e) => fetchSuggestions(e.target.value) }
                            type="text" 
                            placeholder="Search" 
                            className="pl-10 border-navbar-primary text-white placeholder:text-navbar-primary placeholder:opacity-80"
                            />
                        <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-navbar-primary opacity-80" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col w-80 sm:w-96 z-20 px-1">
                    {renderSuggestions()}
                </PopoverContent>
            </Popover>
        </div>
    );
}

function SearchSuggestionCard( { content } : SearchSuggestionCardProps) {
    const isProject = content.project
    const targetUrl = isProject 
        ? `/project/${content.id}`
        : `/account/${content.id}`
    const Icon = isProject
        ? Folder
        : User
 
    return (
        <Link href={targetUrl}>
            <button className="hover:bg-card-textArea grid grid-cols-4 gird-rows-2 w-full rounded-xl" onMouseDown={(e) => e.preventDefault()}>
                <div className="col-span-1 row-span-2 py-1 justify-self-center">
                    <Avatar className={`w-14 h-14 border ${isProject ? "rounded-xl bg-popover" : ""} `}>
                        <AvatarImage src={content.imageUrl} alt="suggestion"/>
                        <AvatarFallback>
                            <Icon className="w-full h-full"/>
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="justify-self-start row-span-1 col-span-3 content-end text-left">
                    <p className="font-semibold line-clamp-1" title={content.name}>{content.name}</p>
                </div>
                <div className="justify-self-start row-span-1 col-span-3 content-start text-left">
                    <p className="text-subtext" title={content.name}>{isProject ? "Project" : "User"}</p>
                </div>
            </button>
        </Link>
    )
}


