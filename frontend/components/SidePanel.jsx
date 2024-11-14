// Main left-side menu/nav panel
import NavButton from "./NavButton.jsx"
import ProjectAccordion from "./ProjectAccordion.jsx"
import {LogOutIcon} from "lucide-react"

export function SidePanel() {
    return (
        <nav className="mt-6 bg-blueLight w-[222px] fixed top-0 bottom-0 pt-16">
            <ul className="flex flex-col h-full">
                <li className="flex flex-col">
                    <NavButton href="/">My Tasks</NavButton>
                </li>
                <li className="flex flex-col">
                    <NavButton href="/deleted">Recently Deleted</NavButton>
                </li>
                <li className="flex flex-col">
                    <NavButton href="/shared">Shared with Me</NavButton>
                </li>
                <hr className="w-48 mx-auto my-6 border-neutral-400"/>
                <li>
                    <menu className="flex flex-col items-center">
                        <ProjectAccordion/>
                    </menu>
                </li>
                <li className="flex flex-col mb-8 mt-auto ">
                    <NavButton href="/Login">Log out
                        <LogOutIcon className="resize scale-50 translate-x-24"></LogOutIcon>
                    </NavButton>
                </li>
            </ul>
        </nav>
    )
}
