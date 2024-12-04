import React, { useEffect, useState } from 'react'
import { authAndFetchProjects, fetchTasks, formatTasks } from '@/lib/taskProjectUtils'

import { Button } from '@/components/ui/button'
import { TaskTable } from '@/components/TaskTable'
import PageTitle from '@/components/PageTitle'
import { TaskSidePanel } from '@/components/TaskSidePanel'
import { taskColumnsProject } from '@/components/TaskColumnsProject'
import { taskColumns } from '@/components/TaskColumns'

import { DrawerTrigger, DrawerContent, DrawerTitle, DrawerHeader } from '@/components/ui/drawer'
import { Drawer, Drawer as DrawerPrimative } from 'vaul'
import { faL } from '@fortawesome/free-solid-svg-icons'

const isPresent = num => !!num || num === 0

export const TaskPage = ({projectId}) => {
    const [pageTitle, setPageTitle] = useState(isPresent(projectId) ? 'Project' : 'My Tasks')
    const [tasks, setTasks] = useState({})
    const [projects, setProjects] = useState(null)
    const [selectedProject, setSelectedProject] = useState(null)
    const [activeTab, setActiveTab] = useState("upcoming")
    const [lastSelectedTask, setLastSelectedTask] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    //Use a ref to track wether a default project has been created or not 
    const [isDefaultProjectCreated, setIsDefaultProjectCreated] = useState(false)


    const createDefaultProject = async () => {
        try {
            const response = await fetch('/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: 'Default Project', description: ''})
            })
            if (!response.ok)
                throw new error(`[${response.status}] ${response.statusText}`)
            const project = await response.json()
            setProjects([project])
            setSelectedProject(project)
            setIsDefaultProjectCreated(true); // Mark default project as created
        } catch (e) {
            console.error('Error creating default project: ', error)
        }
    }

    
    const handleTaskSelect = (taskId) => {
        setIsDrawerOpen(true);
        console.log("Task clicked:", taskId);
        const selectedTask = tasks[taskId];
        console.log("Selected Task:",selectedTask)

        if (!selectedTask) {
            console.error("Task not found");
            return;
        }
        setLastSelectedTask(selectedTask);
//      setIsDrawerOpen(true);
    }

    useEffect(() => {
        authAndFetchProjects(setProjects)
    }, []);

    useEffect(() => {
        if (projects == null)
            return
        if (projects.length === 0 && !isDefaultProjectCreated)
            return createDefaultProject()

        if (isPresent(projectId)) {
            const p = projects.find(project => project.id === projectId)
            if (p) {
                setPageTitle(p.name)
                setSelectedProject(p)
            }
            else
                console.error('TODO: replace this with a 404 page')
        } else
            setSelectedProject(projects[0])

        fetchTasks(setTasks)
    }, [projects, projectId])

    const resetTaskFields = () => {
        setIsDrawerOpen(true);
        setLastSelectedTask(null);
    };

    return (
        <>
            <PageTitle title={`${pageTitle} | Checkmate`}></PageTitle>

            {/* <DrawerContent className={`max-w-[417px] bg-blueLight fixed bottom-0 right-0 ml-auto h-full pt-20 pl-4 ${isDrawerOpen ? 'block' : 'hidden'}`}> */}
                {/* <DrawerHeader>
                    <DrawerTitle>Task Details</DrawerTitle>
                </DrawerHeader> */}


                {/* A.D. - Commented out the Drawer changes because it was causing issues w/ selecting tasks*/}
                <TaskSidePanel selectedTask={lastSelectedTask} setTasks={setTasks} projects={projects} selectedProject={selectedProject} />
            {/* </DrawerContent> */}




            {/* Main Content */}
            <div className="bg-white pt-5 pb-5 w-full">
                <div className="flex flex-col gap-[32px]">
                    <div className="flex flex-col gap-[32px]">
                        <h1 className="text-left text-[48px] font-bold pl-20 pr-20">
                            {pageTitle}
                        </h1>

                        {/* Tab Buttons for Upcoming and Completed */}
                        <div className="border-b">
                            <div className="flex pl-20 pr-20 gap-[32px]">
                                <button
                                    className={`text-[16px] font-semibold ${activeTab === 'upcoming' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab("upcoming")}
                                >
                                    Upcoming
                                </button>
                                <button
                                    className={`text-[16px] font-semibold ${activeTab === 'completed' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab("completed")}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                        <DrawerTrigger asChild>
                            <div className="text-left pl-20 pr-20">
                                <Button onClick={resetTaskFields}>Create New Task</Button>
                            </div>
                        </DrawerTrigger>
                    </div>
                    <section>
                        <TaskTable columns={isPresent(projectId) ? taskColumnsProject : taskColumns}
                                   data={formatTasks(tasks, projects, isPresent(projectId) ? selectedProject : null)
                                            .filter(task => (activeTab === "upcoming" ? !task.completed : task.completed))}
                                   onTaskSelect={handleTaskSelect}
                                   selectedTask={lastSelectedTask}
                                   />
                    </section>
                </div>
            </div>
        </>
    )
}
