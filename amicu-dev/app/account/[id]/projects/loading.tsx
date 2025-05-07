import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyProjectsLoading() {
    return(
        <div className="flex flex-col md:flex-row justify-center gap-x-2">
        <Card className="w-full h-fit max-w-4xl lg:w-5/6 relative">
            <CardContent className="h-fit">
                <div className="min-h-96 h-fit flex flex-col items-center p-2">
                    <div className="absolute top-0 h-11 w-full bg-sidebar rounded-t-xl z-0" />
                    <div className="flex flex-row relative z-10">
                        <p className="text-xl text-sidebar-foreground font-semibold blur-sm">Username</p>
                        <p className="text-xl text-sidebar-foreground font-semibold">&apos; projects</p>
                    </div>
                    <div className="w-full h-[480px] flex flex-wrap gap-4 justify-start sm:justify-start content-start overflow-y-auto py-6">
                        {Array.from({ length : 2 }).map((_,i) => (
                            <div className="flex flex-row w-[250px] h-14 items-center justify-center gap-x-4" key={i}>
                                <Skeleton className="w-16 h-full rounded-3xl" />
                                <div className="w-5/6 h-full grid grid-rows-2 gap-y-2">
                                    <Skeleton className="h-4 w-24"/>
                                    <Skeleton className="h-4 w-36"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="w-72 max-w-4xl hidden lg:flex lg:flex-col relative bg-sidebar shadow-2xl">
            <CardContent>
                <div className="h-96 flex flex-col items-center p-4 gap-y-4">
                    <Skeleton className="h-40 w-40 rounded-full bg-white/10" />
                    <Skeleton className="h-4 w-44 bg-white/10" />
                    <Skeleton className="h-4 w-40 bg-white/10" />
                </div>
            </CardContent>
        </Card>
        </div> 
    )
}