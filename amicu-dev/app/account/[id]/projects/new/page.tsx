'use client'

import CreateProject from "@/components/projects/my_projects/createProject"

export default function NewProject() {
    return(
        <div className="flex flex-col w-full h-fit items-center -mt-10">
            <CreateProject />
        </div>
    )
}