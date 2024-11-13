import React, {useEffect, useState} from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Button} from "./ui/button";
import NavButton from "./NavButton";
import {PlusIcon} from "@radix-ui/react-icons";

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
        const projectName = document.getElementById("project-name").value;
        const projectDescription = document.getElementById("project-description").value;

        let response = await fetch('/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: projectName,
                description: projectDescription,
            })
        })
        let project = undefined
        if (response.ok) {
            project = await response.json()
            console.log(project)
        } else {
            console.log('POST /projects failed to respond')
        }
        fetchProjects();
    };


    return (
        <Accordion defaultValue="projects" type="single" collapsible>
            <AccordionItem value="projects"
                           className="bg-none">
                <div className="relative flex">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute z-10 w-8 h-8 top-1.5 hover:border hover:border-neutral-200 hover:bg-neutral-50 right-14"
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <addProjectpath
                                d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></addProjectpath>
                        </svg>
                        <PlusIcon onClick={addProject}>
                        </PlusIcon>
                    </Button>
                    <AccordionTrigger className="hover:no-underline py-3 px-2 w-44">
                        <span className="pl-2">My Projects</span>
                    </AccordionTrigger>
                </div>
                <AccordionContent className="">
                    <ul className="flex flex-col gap-1 -mx-2 -mb-2">
                        {projects.map((project) => (
                                <li key={project.id} className="grid grid-cols-[70%_30%]">
                                    {/*TODO: USE THIS TO SEND PARAMETERS TO PROJECTS-PAGE*/}
                                    <NavButton
                                        href={`/project/${project.id}`}
                                    >
                                    <span className="flex items-center justify-between w-full pr-4">
                                        <span>{project.name}</span>
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z"
                                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </NavButton>
                                    {/*<Button>*/}
                                    {/*    <Trash2Icon onClick={deleteProject(project.id)} />*/}
                                    {/*</Button>*/}
                            </li>
                        ))}
                    </ul>
                </AccordionContent>
                <AccordionContent className="">
                    <input
                        id="project-name"
                        type="text"
                        placeholder="enter project-name"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 mb-4"
                    >
                    </input>
                    <input
                        id="project-description"
                        type="text"
                        placeholder="enter project-description"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 mb-4"
                    >
                    </input>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default ProjectAccordion;
