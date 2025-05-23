import { CardContent } from "@/components/ui/card";
import ProjectDescriptionEdit from "../projectDescription";
import { Link, Tag } from "lucide-react";
import { AddProjectLink, ProjectLink } from "../projectLinks";
import ProjectTags from "../projectTags";
import { ProjectDashboardData } from "@/lib/types/projectTypes";
import ProjectJoin from "../projectJoin";

interface AboutTabProps {
    content: ProjectDashboardData
    modPriviledges: boolean
}

export default function AboutTab ({ content, modPriviledges } : AboutTabProps) {
    const hasLinks = (content.links && content.links.length !== 0);

    return (
        <CardContent className="flex flex-col gap-10 h-auto w-full pb-10 pt-8">
            <div className="flex flex-col h-auto w-full gap-y-3">
                <div className="flex flex-row gap-x-2">
                    { modPriviledges && (
                        <ProjectDescriptionEdit projectId={content.id} value={content.description}/>
                    )}
                    <p className="text-left text-2xl font-semibold">About This Project</p>
                </div>
                <p className="text-left text-md sm:text-lg lg:text-xl bg-card-textArea h-auto min-h-80 w-full p-4 whitespace-pre-line rounded-lg">
                    {content.description}
                </p>
            </div>
            { hasLinks 
                ? (
                    <div className="flex flex-col h-auto w-full gap-2">
                        <div className="flex flex-row font-semibold gap-x-1 items-center">
                            <Link className="size-5"/>
                            <p className="text-xl">Find us here:</p>
                        </div>
                        <div className="flex flex-row w-full gap-2 z-10">
                            { content.links?.map((link, index) => (
                                <div className="flex flex-row" key={index}>
                                    { index !== 0 && (
                                        <div className="pl-2 border-l border-separator"/>
                                    )}
                                    <ProjectLink url={link} />
                                </div> 
                            ))}
                            { content.github && (
                                <div className="pl-2 border-l border-separator content-center"><ProjectLink url={content.github}/></div>
                                )}
                            { modPriviledges && (
                                <div className="pl-2 border-l border-separator content-center"><AddProjectLink projectId={content.id} content={content.links || []}/></div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row h-auto w-full gap-2 items-center z-10">
                        { content.github && (
                            <div className="flex flex-row items-center gap-x-2">
                                <div className="flex flex-row font-semibold gap-x-1 items-center">
                                    <Link className="size-5"/>
                                    <p className="text-xl">Find us here:</p>
                                </div>
                                <div className="pr-2 border-r border-separator content-center"><ProjectLink url={content.github}/></div>
                            </div>
                            )}
                        { modPriviledges && (
                            <AddProjectLink projectId={content.id} content={content.links || []}/>
                        )}
                    </div>
                )
            }
            <div className="w-full border-b border-separator"/>
            <div className="flex flex-col h-auto w-full gap-y-3 z-10">
                <div className="flex flex-row font-semibold gap-x-1 items-center">
                    <Tag className="size-5"/>
                    <p className="text-xl">Tags</p>
                </div>
                <ProjectTags projectId={content.id} editable={modPriviledges}/>
            </div>

            <div className="flex justify-center w-full border-t border-separator lg:hidden py-10">
                <ProjectJoin projectId={content.id} />
            </div>
        </CardContent>
    )
}