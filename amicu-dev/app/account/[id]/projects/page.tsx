import ProjectsCard from "@/components/projects/my_projects/projects";
import { getUserProjects } from "@/lib/server/getUserProjects";
import { ReducedClerkData } from "@/lib/types/profileTypes";
import { clerkClient} from "@clerk/nextjs/server";
import { notFound } from "next/navigation";


export default async function MyProjects({ params } : { params : Promise<{ id : string }> }) {

    const userId =  (await params).id;

    if (!userId) 
        notFound();

    try {
        const projects = await getUserProjects(userId);

        if(!projects)
            throw new Error(`failed to fetch project data`);
        
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const userReduced : ReducedClerkData = {
            id : user.id,
            username : user.username,
            emailAddress : user.emailAddresses[0].emailAddress,
            firstName : user.firstName,
            lastName : user.lastName,
            imageUrl : user.imageUrl
        }

        return (
            <ProjectsCard userProjects={projects} user={userReduced} />
        )

    } catch (err) {
        console.error('Server-side fetch error: ', err);
        return (
            <ProjectsCard userProjects={[]} user={null} error="Failed to load data" />
        )
    }
}