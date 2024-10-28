// Accordion for different projects
import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Button } from "./ui/button"
import NavButton from "./NavButton";

function ProjectAccordion(){
    return(
        <Accordion defaultValue="projects" type="single" collapsible>
            <AccordionItem value="projects" className=" w-48  whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50">
                {/* Accordion label and add project button */}
                <div className="relative flex ">
                    <Button
                        size="icon"
                        variant={"ghost"}
                        onClick={()=>console.log("add project")}
                        className="absolute z-10 w-8 h-8 top-1.5 hover:border hover:border-neutral-200 hover:bg-neutral-50 right-14 "
                    >
                        {/* Plus icon with custom resize */}
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </Button>
                    <AccordionTrigger className="hover:no-underline py-3 px-2 w-44 ">
                        <span className="pl-2">My Projects</span>
                    </AccordionTrigger>
                </div>
                <AccordionContent className="">
                {/* List of projects (currently filled with stand-ins) */}
                <ul className="flex flex-col gap-1 -mx-2 -mb-2">
                    <li className="flex flex-col">
                        <NavButton href="/project-1">
                            <span className="flex items-center justify-between w-full pr-4">
                                <span>Project 1</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </span>
                        </NavButton>
                    </li>
                    <li className="flex flex-col">
                        <NavButton href="/project-2">
                            <span className="flex items-center justify-between w-full pr-4">
                                <span>Project 2</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </span>
                        </NavButton>
                    </li>
                </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
export default ProjectAccordion;
