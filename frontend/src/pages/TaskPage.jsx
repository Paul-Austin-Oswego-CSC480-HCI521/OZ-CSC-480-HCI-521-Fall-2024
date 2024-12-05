import React, { useContext, useEffect, useState } from 'react'
import { fetchTasks, formatTasks, ProjectContext } from '@/lib/taskProjectUtils'

import { Button } from '@/components/ui/button'
import { TaskTable } from '@/components/TaskTable'
import PageTitle from '@/components/PageTitle'
import { TaskSidePanel } from '@/components/TaskSidePanel'
import { taskColumns } from '@/components/TaskColumns'

import { DrawerTrigger, DrawerContent, DrawerTitle, DrawerHeader } from '@/components/ui/drawer'
import { Drawer, Drawer as DrawerPrimative } from 'vaul'
import { faL } from '@fortawesome/free-solid-svg-icons'

export const TaskPage = () => {
    const [tasks, setTasks] = useState({})
    const { projects } = useContext(ProjectContext)
    const [selectedProject, setSelectedProject] = useState(null)
    const [activeTab, setActiveTab] = useState("upcoming")
    const [lastSelectedTask, setLastSelectedTask] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    
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
        if (!selectedProject || projects.find(p => selectedProject.id === p.id) == undefined)
            setSelectedProject(projects[0])

        fetchTasks(setTasks)
    }, [projects])

    const resetTaskFields = () => {
        setIsDrawerOpen(true);
        setLastSelectedTask(null);
    };

    return (
        <>
            <PageTitle title={`My Tasks | Checkmate`}></PageTitle>

            {/* <DrawerContent className={`max-w-[417px] bg-blueLight fixed bottom-0 right-0 ml-auto h-full pt-20 pl-4 ${isDrawerOpen ? 'block' : 'hidden'}`}> */}
                {/* <DrawerHeader>
                    <DrawerTitle>Task Details</DrawerTitle>
                </DrawerHeader> */}


                {/* A.D. - Commented out the Drawer changes because it was causing issues w/ selecting tasks*/}
                
                <TaskSidePanel
                    selectedTask={lastSelectedTask}
                    setTasks={setTasks}
                    projects={projects}
                    selectedProject={selectedProject}
                />
                
            {/* </DrawerContent> */}

            {/* Main Content */}
            <TaskPageContent pageTitle={'My Tasks'} headers={
                <TaskPageHeaders activeTab={activeTab} setActiveTab={setActiveTab} onCreateTask={resetTaskFields}/>
            }>
                <TaskTable
                    columns={taskColumns}
                    data={formatTasks(tasks, projects, activeTab)}
                    onTaskSelect={handleTaskSelect}
                    selectedTask={lastSelectedTask}
                    tasks={tasks}
                    setTasks={setTasks}
                />
            </TaskPageContent>
        </>
    )
}

export const TaskPageContent = ({pageTitle, headers, children}) => (
    <div className="bg-white pt-5 pb-5 w-full">
        <div className="flex flex-col gap-[32px]">
            <div className="flex flex-col gap-[32px]">
                <h1 className="text-left text-[48px] font-bold pl-20 pr-20">
                    {pageTitle}
                </h1>
                {headers}
            </div>
            <section>
                {children}
            </section>
        </div>
    </div>
)

export const TaskPageHeaders = ({activeTab, setActiveTab, onCreateTask}) => (<>
    {/* Tab Buttons for Upcoming and Completed */}
    <div className="border-b">
    <div className="flex pl-20 pr-20 gap-[32px]">
        <button
            className={`text-[16px] font-semibold ${activeTab === 'upcoming' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upcoming')}
        >
            Upcoming
        </button>
        <button
            className={`text-[16px] font-semibold ${activeTab === 'completed' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('completed')}
            >
            Completed
        </button>
    </div>
    </div>
    <DrawerTrigger asChild>
    <div className="text-left pl-20 pr-20">
        <Button onClick={onCreateTask}>Create New Task</Button>
    </div>
    </DrawerTrigger>
</>)
