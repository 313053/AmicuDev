import ProjectDashboard from "@/components/projects/project_menu/projectDashboard";
import { getProjectData } from "@/lib/server/getProjectData";
import { notFound } from "next/navigation";

export default async function Project({ params } : { params : Promise<{ id: string }>}) {

    const projectId = (await params).id;

    if (!projectId)
        notFound();

    try {
        const project = await getProjectData(projectId);

        if(!project)
            throw new Error('failed to fetch project data');

        return (
            <ProjectDashboard content={project}/>
        )
    } catch (err) {
        console.error('Server-side fetch error', err);
        return (
            <></>
        )
    }


}