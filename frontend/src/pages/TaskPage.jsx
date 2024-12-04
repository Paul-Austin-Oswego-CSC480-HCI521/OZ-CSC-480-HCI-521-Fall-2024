import React, { useContext, useEffect, useMemo, useState } from 'react'
import { fetchTasks, formatTasks, ProjectContext } from '@/lib/taskProjectUtils'

import { Button } from '@/components/ui/button'
import { TaskTable } from '@/components/TaskTable'
import PageTitle from '@/components/PageTitle'
import { TaskSidePanel } from '@/components/TaskSidePanel'
import { taskColumnsProject } from '@/components/TaskColumnsProject'
import { taskColumnsDeleted } from '@/components/TaskColumnsDeleted'
import { taskColumns } from '@/components/TaskColumns'

import { DrawerTrigger, DrawerContent, DrawerTitle, DrawerHeader } from '@/components/ui/drawer'
import { Drawer, Drawer as DrawerPrimative } from 'vaul'
import { faL } from '@fortawesome/free-solid-svg-icons'

export const TaskPage = ({variant, projectId}) => {
    const isProject = useMemo(() => variant === 'project', variant)
    const [pageTitle, setPageTitle] = useState(isProject ? 'Project' : 'My Tasks')
    const [tasks, setTasks] = useState({})
    const { projects } = useContext(ProjectContext)
    const [selectedProject, setSelectedProject] = useState(null)
    const [activeTab, setActiveTab] = useState("upcoming")
    const [lastSelectedTask, setLastSelectedTask] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const isTrash = useMemo(() => variant === 'trash', [variant])
    const columns = useMemo(() => {
        if (isProject)
            return taskColumnsProject
        else if (isTrash)
            return taskColumnsDeleted
        else
            return taskColumns
    }, [isProject, isTrash])
    const tableTasks = useMemo(() => {
        const formatted = formatTasks(tasks, projects, isProject ? selectedProject : null)
        if (isTrash)
            return formatted
        else
            return formatted.filter(task => (activeTab === "upcoming") ? !task.completed : task.completed)
    }, [isProject, isTrash, projectId, tasks, activeTab])
    
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
        if (projects == null || projects.length === 0)
            return
        
        if (isProject) {
            const p = projects.find(project => project.id === projectId)
            if (p) {
                setPageTitle(p.name)
                setSelectedProject(p)
            }
            else
                console.error('TODO: replace this with a 404 page')
        } else if (!selectedProject || projects.find(p => selectedProject.id === p.id) == undefined)
            setSelectedProject(projects[0])

        if (isTrash)
            setPageTitle('Recently Deleted')


        fetchTasks(setTasks, isTrash)
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
                {!isTrash ? 
                    <TaskSidePanel selectedTask={lastSelectedTask} setTasks={setTasks} projects={projects} selectedProject={selectedProject} />
                : <></>}
            {/* </DrawerContent> */}




            {/* Main Content */}
            <div className="bg-white pt-5 pb-5 w-full">
                <div className="flex flex-col gap-[32px]">
                    <div className="flex flex-col gap-[32px]">
                        <h1 className="text-left text-[48px] font-bold pl-20 pr-20">
                            {pageTitle}
                        </h1>

                        {!isTrash ?
                            <>
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
                            </>
                        : <></> }
                    </div>
                    <section>
                        <TaskTable columns={columns}
                                   data={tableTasks}
                                   onTaskSelect={handleTaskSelect}
                                   selectedTask={lastSelectedTask}
                                   tasks={tasks}
                                   setTasks={setTasks}
                                   />
                    </section>
                </div>
            </div>
        </>
    )
}
