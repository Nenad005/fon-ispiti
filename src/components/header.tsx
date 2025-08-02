import AddButton from "./add-button";
import { ModeToggle } from "./ui/mode-toggle";

export default function Header(){
    return <header className="w-full flex justify-center border-b">
        <div className="flex justify-start w-full md:w-[760px] items-center px-5 py-2 gap-3">
            <a className="h-16 aspect-auto mr-auto" href="https://oas.fon.bg.ac.rs/raspored-ispita/">
                <img className="w-full h-full dark:brightness-0 dark:invert" src={"https://oas.fon.bg.ac.rs/wp-content/uploads/2023/04/FON-Logo-Tamni.png.webp"}></img>
            </a>
            <AddButton/>
            <ModeToggle/>
        </div>
    </header>
}