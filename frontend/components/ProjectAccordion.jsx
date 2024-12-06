import React, { useContext } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Button} from "./ui/button";
import NavButton from "./NavButton";

import {TrashIcon, ChevronDownIcon, PlusIcon} from "@radix-ui/react-icons";
import { ProjectContext } from "@/lib/taskProjectUtils";
import {Trash2Icon} from "lucide-react";

function ProjectAccordion() {
    const { projects, trashProject, addProject } = useContext(ProjectContext);

    return (
        <Accordion defaultValue="projects" type="single" collapsible>
            <AccordionItem value="projects"
                           className="bg-none">
                <div className="relative">
                    <AccordionTrigger className="hover:no-underline py-3 w-[12rem]">
                        <span className="pl-3 font-normal text-sm">My Projects</span>
                        <ChevronDownIcon className="text-gray-500 w-5 h-6 mr-3 fill-black"/>
                    </AccordionTrigger>
                    {/* added onclick to button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={addProject}
                        //added 'flex justify-center items-center'
                        className="absolute z-10 w-10 h-10 top-1  left-28 hover:border hover:border-neutral-200 hover:bg-neutral-50"
                    >
                        
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* replaced <addProjectpath with <path*/}
                            <path
                                d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    </Button>
                </div>
                <AccordionContent className="">
                    <ul className="flex flex-col justify-items-start gap-1">
                        {projects ? projects.map((project) => (
                            <li key={project.id}>
                                <ul className="relative">
                                    <li>
                                        {/* Project Name */}
                                        <NavButton href={`/project/${project.id}`}
                                            className="flex items-center justify-between">
                                            <span className="w-[11rem]">
                                                {project.name}
                                            </span>
                                        </NavButton>
                                    </li>
                                    <li className="absolute right-0 top-0 mr-1">
                                        <button
                                            onClick={() => trashProject(project.id)}
                                            className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-gray-200">
                                            <TrashIcon className="text-gray-500 w-5 h-5"/>
                                        </button>
                                    </li>
                                </ul>
                            </li>

                        )) : <></>}
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <hr className="w-[11rem] ml-1 border-neutral-400"/>
        </Accordion>
    );
}

export default ProjectAccordion;
