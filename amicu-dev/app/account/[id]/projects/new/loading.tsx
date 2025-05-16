import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dot } from "lucide-react";

export default function NewProjectLoading() {
    return(
        <div className="flex flex-col w-full h-fit items-center -mt-10">
            <Card className="flex flex-col justify-between h-fit min-h-96 w-full max-w-xl">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-row justify-center gap-x-2">
                            <Dot strokeWidth={5} className="text-button"/>
                            <Dot className="opacity-20"/>
                            <Dot className="opacity-20"/>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-y-4">
                    <div className="flex flex-col h-fit w-full gap-y-2">
                        <Skeleton className="h-6 w-1/5" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="flex flex-col h-fit w-full gap-y-2">
                        <Skeleton className="h-6 w-1/5" />
                        <Skeleton className="h-56 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}