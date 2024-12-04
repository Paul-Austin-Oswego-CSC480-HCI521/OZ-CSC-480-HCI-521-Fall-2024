import React, {useEffect, useState} from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Button} from "./ui/button";
import NavButton from "./NavButton";
import {TrashIcon, ChevronDownIcon} from "@radix-ui/react-icons";

function ProjectAccordion() {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/projects');
            if (response.ok) {
                const projectData = await response.json();
                setProjects(projectData);
            } else {
                console.error("Failed to fetch projects:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const deleteProject = async (projectID) => {
        try {
            const response = await fetch(`/projects/${projectID}`, {method: 'DELETE'});
            if (response.ok) {
                setProjects(prevTasks => prevTasks.filter(projects => projects.id !== projectID));
            } else {
                console.log(`Error deleting task ${projectID}`);
            }
        } catch (e) {
            console.error(e.message);
        }
    };

    const addProject = async () => {
        const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        const projectName = `Project ${nextId}`;

        let response = await fetch('/projects', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: projectName,
            })
        });

        if (response.ok) {
            const newProject = await response.json();
            console.log('Created new project:', newProject);
            setProjects(prevProjects => [...prevProjects, newProject]);
        } else {
            console.log('POST /projects failed to respond');
        }
    };


    return (
        <Accordion defaultValue="projects" type="single" collapsible>
            <AccordionItem value="projects"
                           className="bg-none">
                <div className="relative">
                    <AccordionTrigger className="hover:no-underline py-3 w-[12rem]">
                        <span className="pl-3 font-normal text-sm">My Projects</span>
                        <ChevronDownIcon className="text-gray-500 w-5 h-5 mr-3 fill-black"/>
                    </AccordionTrigger>
                    {/* added onclick to button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={addProject}
                        //added 'flex justify-center items-center'
                        className="absolute z-10 w-10 h-10 top-1  left-28 hover:border hover:border-neutral-200 hover:bg-neutral-50"
                    >
                        
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                             >
                            {/* replaced <addProjectpath with <path*/}
                            <path
                                d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    </Button>
                </div>
                <AccordionContent className="">
                    <ul className="flex flex-col justify-items-start gap-1">
                        {projects.map((project) => (
                            <li key={project.id}>
                                <ul className="relative">
                                    <li>
                                        <NavButton href={`/project/${project.id}`}
                                            className="flex items-center justify-between">
                                            <span className="w-[11rem]">
                                                {project.name}
                                            </span>
                                        </NavButton>
                                    </li>
                                    <li className="absolute right-0 top-0 mr-1">
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-gray-200">
                                            <TrashIcon className="text-gray-500 w-5 h-5"/>
                                        </button>
                                    </li>
                                </ul>
                            </li>

                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default ProjectAccordion;
