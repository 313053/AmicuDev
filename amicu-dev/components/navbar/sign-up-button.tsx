"use client"

import { useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button";


export default function SignUpButton () {
    const { redirectToSignUp } = useClerk();

    return(
            <Button className="w-20" variant="navbar" onClick={() => redirectToSignUp()}>
                Sign Up
            </Button>
    );
}