"use client"

import { useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button";
import clsx from "clsx";


export default function SignInButton ({ className = ""}) {
    const { redirectToSignIn } = useClerk();

    return(
            <Button 
                className={clsx("w-20", className)}
                variant="navbar" 
                onClick={() => redirectToSignIn()}
            >
                Sign In
            </Button>
    );
}