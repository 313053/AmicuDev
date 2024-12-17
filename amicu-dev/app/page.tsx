import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col items-center mt-20">
      <p className="text-6xl sm:text-8xl font-mono font-bold">AmicuDev</p>
      <p className="text-2xl sm:text-5xl font-semibold text-subtext py-5 text-center">Starting projects has never been easier.</p>
      <Link href="/explore" className="py-5 flex-shrink">
        <Button type="button" variant="default"><ArrowRight />Get started</Button>  
      </Link>
    </div>
  );
}

