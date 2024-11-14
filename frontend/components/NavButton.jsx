// Custom nav link button component for left-side bar
import { NavLink } from "react-router-dom"
// Keep spaces on either side of class lists!
const activeClasses = "  bg-white hover:bg-neutral-100 hover:text-neutral-900"
const inactiveClasses = " bg-blueLight hover:bg-neutral-100 hover:text-neutral-900"
const baseClasses = " py-2 pl-3  mx-4 inline-flex items-center justify-left whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 "
function NavButton(props){
    return (
        <NavLink to={props.href} className={({ isActive, isPending }) =>
            isPending ? (baseClasses+inactiveClasses) : isActive ? (baseClasses+activeClasses) : (baseClasses+inactiveClasses)
          }>
                {props.children}
        </NavLink>
    )
}

export default NavButton;