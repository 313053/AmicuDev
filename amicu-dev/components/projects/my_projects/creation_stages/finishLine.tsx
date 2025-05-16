'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dot, Frown, LoaderCircle } from "lucide-react";
import Link from "next/link";

interface FinishLineProps {
  errorState : boolean;
  loadingState : boolean;
  onRestart : () => void;
  newId : string;
}

export default function FinishLine({ errorState, loadingState, onRestart, newId } : FinishLineProps ) {

  
    if(loadingState) {
        return(
            <Card className="flex flex-col justify-start h-fit min-h-96 w-full max-w-xl">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-row justify-center gap-x-2">
                            <Dot className="opacity-20"/>
                            <Dot className="opacity-20"/>
                            <Dot strokeWidth={5} className="text-button"/>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-y-4 mt-20">
                    <p className="text-2xl font-semibold">Creating Your Project...</p>
                    <LoaderCircle className="animate-spin size-7"/>
                </CardContent>
            </Card>
        )
    }

    if(errorState){
        return (
            <Card className="flex flex-col justify-start h-fit min-h-96 w-full max-w-xl">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-row justify-center gap-x-2">
                            <Dot className="opacity-20"/>
                            <Dot className="opacity-20"/>
                            <Dot strokeWidth={4}/>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-y-4">
                    <Frown className="size-16"/>
                    <p className="text-3xl font-semibold">Something Went Wrong</p>
                    <p className="italic">Your project couldn&apos;t be created</p>
                    <Button onClick={onRestart}>
                        Try again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col justify-start h-fit min-h-96 w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row justify-center gap-x-2">
                        <Dot className="opacity-20"/>
                        <Dot className="opacity-20"/>
                        <Dot strokeWidth={4}/>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-y-4 mt-10">
                <p className="text-3xl font-semibold">SUCCESS!</p>
                <p className="italic">Your project was succesfully created</p>
                <Link href={`/project/${newId}`}>
                    <Button>
                        Proceed
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}