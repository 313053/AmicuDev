"use client"

import { useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button";
import clsx from "clsx";


export default function SignUpButton ({ className = ""}) {
    const { redirectToSignUp } = useClerk();

    return(
            <Button 
                className={clsx("w-20", className)}
                variant="navbar" 
                onClick={() => redirectToSignUp()}
            >
                Sign Up
            </Button>
    );
}