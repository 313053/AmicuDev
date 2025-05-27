import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProject() {
    return (
        <div className="flex flex-col h-auto min-h-[800px] w-full -mt-10 mb-20 items-center gap-y-2">
            <Card className="h-auto min-h-20 w-full sm:w-5/6 bg-sidebar border-none content-center">
                <CardContent className="py-2 px-3 sm:px-6 flex flex-col sm:flex-row justify-between items-center relative gap-y-2">
                    <div className="flex flex-row justify-center sm:justify-start items-center content-center gap-x-2 w-full sm:w-1/2 h-auto overflow-hidden">
                        <Skeleton className="w-3/4 h-8" />
                    </div>
                    <div className="flex flex-row justify-around sm:justify-end w-full sm:w-1/2 h-full items-center">
                        <Skeleton className={`w-1/3 sm:w-20 h-6`} />
                        <Skeleton className={`w-1/3 sm:w-20 h-6`} />
                        <Skeleton className={`w-1/3 sm:w-20 h-6`} />
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-row h-auto min-h-[720px] w-full sm:w-5/6 gap-x-2 items-stretch">
                <Card className=" w-full">
                    <CardContent className="flex flex-col gap-10 h-auto w-full pb-10 pt-8">
                        <div className="flex flex-col h-auto w-full gap-y-3">
                            <div className="flex flex-row gap-x-2">
                                <Skeleton className="w-1/3 h-6"/>
                            </div>
                            <Skeleton className="h-80 w-full"/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-2/6 min-w-60 bg-sidebar hidden lg:block">
                        <CardContent className="flex flex-col h-full w-full items-center p-4 gap-y-6">
                            <Skeleton className="h-40 w-40" />
                            <div className="border-b border-sidebar-foreground opacity-10 w-full"/>
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </CardContent>
                </Card>
            </div>
        </div>
    )
}