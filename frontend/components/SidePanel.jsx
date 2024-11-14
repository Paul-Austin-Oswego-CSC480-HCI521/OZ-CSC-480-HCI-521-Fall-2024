// Main left-side menu/nav panel
import NavButton from "./NavButton.jsx"
import ProjectAccordion from "./ProjectAccordion.jsx"
import {LogOutIcon} from "lucide-react"

export function SidePanel() {
    return (
        <header className=" bg-[#CBD5E1] min-w-[222px] h-screen ">
            <div className="h-36 flex justify-center items-end pb-10 "
                 onClick={() => window.location.href = 'http://localhost:2080/'}>
                <div className="flex items-center gap-2">
                    <div className="bg-black w-12 h-12 rounded-full"></div>
                    <h1 className="text-2xl font-bold">Checkmate</h1>
                </div>
            </div>
            <nav className="">
                <ul className="flex flex-col">
                    <li className="flex flex-col">
                        <NavButton href="/">My Tasks</NavButton>
                    </li>
                    <li className="flex flex-col">
                        <NavButton href="/completed">Completed</NavButton>
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
