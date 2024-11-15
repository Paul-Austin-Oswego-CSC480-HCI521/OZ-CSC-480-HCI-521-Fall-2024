// Main left-side menu/nav panel
import NavButton from "./NavButton.jsx"
import ProjectAccordion from "./ProjectAccordion.jsx"
import {LogOutIcon} from "lucide-react"

export function SidePanel() {
    return (
        <header className=" bg-blueLight w-[222px] fixed top-0 bottom-0 pt-16">
            <nav className="mt-6">
                <ul className="flex flex-col">
                    <li className="flex flex-col">
                        <NavButton href="/">My Tasks</NavButton>
                    </li>
                    <li className="flex flex-col">
                        <NavButton href="/deleted">Recently Deleted</NavButton>
                    </li>
                    <li className="flex flex-col">
                        <NavButton href="/shared">Shared with Me</NavButton>
                    </li>
                </ul>
            </nav>
            <hr className="w-48 mx-auto my-6 border-neutral-400"/>
            <nav className="flex flex-col items-center">
                <ProjectAccordion/>
            </nav>
            <nav className="">
                <ul className="flex flex-col ">
                    <li className="flex flex-col fixed bottom-10 min-w-56 ">
                        <NavButton href={`${import.meta.env.VITE_AUTH_ROOT}/auth/logout`}>Log out
                            <LogOutIcon className="resize scale-50 translate-x-24"></LogOutIcon>
                        </NavButton>

                    </li>
                </ul>
            </nav>

        </header>
    )
}
