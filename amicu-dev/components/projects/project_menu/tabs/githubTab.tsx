import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GitHubAPICommit, ProjectGithubData } from "@/lib/types/projectTypes";
import { CircleDot, Clock, Dot, Download, Eye, GitFork, Github, LucideIcon, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import ProjectRepoEdit from "../projectRepo";


interface githubTabProps {
    projectId: bigint
    repoLink: string
    modPriviledges: boolean
}

interface StatisticProps {
    name: string
    data: number
    icon: LucideIcon
}


export default function GithubTab({ projectId, repoLink, modPriviledges } : githubTabProps) {
    const [ loadingState, setLoadingState ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ noRepo, setNoRepo ] = useState(repoLink.trim() === "");
    const [ repoData, setRepoData ] = useState<ProjectGithubData | null>(null);
    const [ downloadUrl, setDownloadUrl ] = useState("");
    const [ ghubDesktopUrl, setGhubDesktopUrl ] = useState("");

    const fetchRepoData = async () => {
        if(!repoLink){
            setNoRepo(true);
            return;
        }

        try {
            setLoadingState(true);
            const url = new URL(repoLink);
            const [ owner, repo ] = url.pathname.slice(1).split('/');
            
            if (!owner || !repo)
                throw new Error(`Invalid repo link!`)

            setDownloadUrl(`https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`);
            setGhubDesktopUrl(`x-github-client://openRepo/https://github.com/${owner}/${repo}`);

            const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                headers: { 
                    Accept: 'application/vnd.github+json'
                },
            });

            const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
                headers: { 
                    Accept: 'application/vnd.github+json'
                },
            });

            if (!repoResponse.ok || !commitsResponse.ok) 
                throw new Error(`Failed to fetch repo data: repo - ${repoResponse.status}, commits - ${commitsResponse.status}`);
            
            const repoData = await repoResponse.json();
            const commitsData = await commitsResponse.json();
            const formattedData: ProjectGithubData = {
                name: repoData.name,
                owner: {
                    login: repoData.owner.login,
                    avatarUrl: repoData.owner.avatar_url,
                    profileUrl: repoData.owner.html_url,
                },
                url: repoData.html_url,
                createdAt: new Date(repoData.created_at),
                updatedAt: new Date(repoData.updated_at),
                stars: repoData.stargazers_count,
                watchers: repoData.subscribers_count,
                forks: repoData.forks_count,
                issues: repoData.open_issues_count,
                commits: commitsData.slice(0, 5).map((commit: GitHubAPICommit) => ({
                    author: {
                        login: commit.author?.login ?? 'Unknown',
                        profileUrl: commit.author?.html_url ?? '#',
                    },
                    message: commit.commit.message,
                    date: new Date(commit.commit.author.date),
                    url: commit.html_url,
                })),
            };
            setNoRepo(false);
            setRepoData(formattedData);
            console.log(repoData);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Unknown error occured");
        } finally {
            setLoadingState(false);
        }

    }

    useEffect(() => {
        fetchRepoData();
    }, [repoLink]);


    if (loadingState) {
        return(
            <CardContent className="flex flex-col gap-6 h-full w-full pb-10 pt-8">
                <div className="flex flex-col gap-1 px-0">
                    <Skeleton className="w-1/3 h-10" />
                    <Skeleton className="w-1/4 h-8" />
                </div>
                <div className="flex flex-col h-auto w-full gap-2">
                    <Skeleton className="w-1/3 h-9" />
                    <Skeleton className="w-full h-60" />
                    <div className="flex flex-col lg:grid lg:grid-cols-4 w-full gap-6 px-6 sm:px-0">
                        <Skeleton className="lg:col-span-1 lg:justify-self-center w-full lg:w-2/3 h-5" />
                        <Skeleton className="lg:col-span-1 lg:justify-self-center w-full lg:w-2/3 h-5" />
                        <Skeleton className="lg:col-span-1 lg:justify-self-center w-full lg:w-2/3 h-5" />
                        <Skeleton className="lg:col-span-1 lg:justify-self-center w-full lg:w-2/3 h-5" />
                    </div>
                </div>
                <div className="grid grid-rows-2 sm:grid-cols-2 w-full h-32 gap-y-2 mt-0 sm:mt-10">
                    <Skeleton className="row-span-1 sm:col-span-1 justify-self-center w-4/6 h-12 sm:w-32" />
                    <Skeleton className="row-span-1 sm:col-span-1 justify-self-center w-4/6 h-12 sm:w-32" />
                </div>
            </CardContent>
        )
    }

    if (error) {
        return(
            <CardContent className="flex flex-col gap-6 h-full w-full pb-10 pt-8">
                <div className="h-full w-full flex-row justify-center items-center">
                    <p className="text-2xl text-center font-semibold">{error}</p>
                </div>
            </CardContent>
        )
    }

    if (noRepo) {
        return (
            <CardContent className="flex flex-col gap-6 h-full w-full pb-10 pt-8 justify-center">
                <div className="h-full w-full flex-col justify-center items-center mt-10 sm:mt-32">
                    <p className="text-2xl text-center font-semibold">This project has no connected github repository</p>
                    { modPriviledges && (
                        <ProjectRepoEdit projectId={projectId} value={repoLink} noRepo={true}/>
                    )}
                </div>
            </CardContent>
        )
    }

    return (
        <CardContent className="flex flex-col gap-10 h-auto w-full pb-10 pt-8 px-0 sm:px-6">
            <div className="flex flex-col gap-1 px-6 sm:px-0">
                <div className="flex flex-row gap-2 items-center">
                    { modPriviledges && (
                        <ProjectRepoEdit projectId={projectId} value={repoLink} noRepo={false}/>
                    )}
                    <p className="text-left text-3xl md:text-4xl font-semibold">Repo:&nbsp;
                        <a href={repoLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                            {repoData?.name}
                        </a>
                    </p>
                </div>
                <div className="flex flex-row gap-1 items-center text-subtext font-semibold">
                    <a href={repoData?.owner.profileUrl} target="_blank" rel="noopener noreferrer">
                        <Avatar className="w-6 h-6 border border-separator hover:opacity-70">
                            <AvatarImage src={repoData?.owner.avatarUrl} alt="avatar"/>
                            <AvatarFallback className="w-full h-full">
                                <User className="w-full h-full" />
                            </AvatarFallback>
                        </Avatar>
                    </a>
                    <a href={repoData?.owner.profileUrl} target="_blank" rel="noopener noreferrer">
                        <p className="hover:underline">{repoData?.owner.login}</p>
                    </a>
                    <div className="flex flex-row gap-1 items-center">
                        <Dot className="w-4 h-4"/>
                        <p>Created {repoData?.createdAt.toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-auto w-full gap-2">
                <p className="text-xl md:text-2xl font-semibold px-6 sm:px-0">Latest Commits</p>
                <div className="flex flex-col h-auto min-h-36 w-full bg-card-textArea border-2 border-card-border rounded-xl shadow-md">
                    <div className="grid grid-cols-4 items-center h-auto min-h-12 w-full 
                                    border-b-2 border-card-border text-md sm:text-xl font-semibold px-2 sm:px-4">
                        <p className="col-span-1 text-left">User</p>
                        <p className="col-span-2 text-center">Message</p>
                        <div className="col-span-1 justify-self-end"><Clock strokeWidth={2}/></div>
                    </div>
                    <div className="flex flex-col h-auto w-full divide-y-2 divide-card-border md:text-lg">
                        { repoData?.commits.map((commit, index) => (
                            <a href={commit.url} target="_blank" rel="noopener noreferrer" key={index} className="w-full">
                                <div className="grid grid-cols-4 h-auto w-full text-subtext px-2 sm:px-4 py-2 hover:text-primary hover:bg-card">
                                    <p className="col-span-1 truncate text-left">{commit.author.login}</p>
                                    <p className="col-span-2 truncate text-left" title={commit.message}>{commit.message}</p>
                                    <p className="col-span-1 truncate text-right">{commit.date.toLocaleDateString()}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col lg:grid lg:grid-cols-4 w-full gap-1 px-6 sm:px-0">
                    <Statistic name="Watchers" data={repoData?.watchers || 0} icon={Eye} />
                    <Statistic name="Stars" data={repoData?.stars || 0} icon={Star} />
                    <Statistic name="Forks" data={repoData?.forks || 0} icon={GitFork} />
                    <Statistic name="Issues" data={repoData?.issues || 0} icon={CircleDot} />
                </div>
            </div>
            <div className="grid grid-rows-2 sm:grid-cols-2 w-full h-auto z-10 gap-y-2 mt-0 sm:mt-10">
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="row-span-1 sm:col-span-1 justify-self-center w-4/6 sm:w-auto">
                    <Button className="w-full sm:w-auto">
                        <Download />
                        Download zip
                    </Button>
                </a>
                <a href={ghubDesktopUrl} target="_blank" rel="noopener noreferrer" className="row-span-1 sm:col-span-1 justify-self-center w-4/6 sm:w-auto">
                    <Button className="w-full sm:w-auto">
                        <Github />
                        Github Desktop
                    </Button>
                </a>
            </div>
        </CardContent>
    )
}

function Statistic({ name, data, icon: Icon } : StatisticProps ) {
    return(
        <div className="flex flex-row font-semibold gap-x-2 items-center opacity-30 lg:col-span-1 lg:justify-self-center">
            <div className="flex flex-row justify-start items-center gap-x-1"><Icon size={20}/>{name}:</div>
            <div className="flex-grow h-1 border-t-2 border-dotted border-subtext translate-y-1 lg:hidden"/>
            <span className="text-right">{data}</span>
        </div>
    )   
}