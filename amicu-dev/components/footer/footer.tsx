import Link from "next/link";


export default function Footer() {
    return(
        <footer className="flex justify-center items-center align-middle absolute bottom-0 w-full shadow-inner sm:h-14">
            <p className="text-center text-subtext opacity-60">
            Created by&nbsp;
            <Link href="https://github.com/313053" className="hover:underline text-subtext"target="_blank" rel="noopener noreferrer">
                Wiktor Piórkowski
            </Link>
            &nbsp;under&nbsp;
            <Link href="https://www.gnu.org/licenses/gpl-3.0.html" className="hover:underline text-subtext" target="_blank" rel="noopener noreferrer">
                GPLv3 License
            </Link>
            </p>
        </footer>
    );
}