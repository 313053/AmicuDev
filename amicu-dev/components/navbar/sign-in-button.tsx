"use client"

import { useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button";


export default function SignInButton () {
    const { redirectToSignIn } = useClerk();

    return(
            <Button className="w-20" variant="navbar" onClick={() => redirectToSignIn()}>
                Sign In
            </Button>
    );
}