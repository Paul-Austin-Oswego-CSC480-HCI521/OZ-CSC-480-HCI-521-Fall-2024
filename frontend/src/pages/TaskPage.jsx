import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";

import {TaskTable} from '@/components/TaskTable'
import {taskColumns} from "@/components/TaskColumns";

import {DrawerTrigger, DrawerContent, DrawerTitle, DrawerHeader} from "@/components/ui/drawer";
import { Drawer, Drawer as DrawerPrimitive } from "vaul"
import { faL } from "@fortawesome/free-solid-svg-icons";

import PageTitle from '@/components/PageTitle'
import { TaskSidePanel } from "@/components/TaskSidePanel";

const priorityOrder = {
    0: 'No Priority',
    1: 'Low',
    2: 'Medium',
    3: 'High',
};

export function TaskPage() {
    const [tasks, setTasks] = useState({});
    const [projects, setProjects] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null)
    const [activeTab, setActiveTab] = useState("upcoming");
    const [lastSelectedTask, setLastSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const getProjectName = (projectId) => {
        const project = projects.find(project => project.id === projectId);
        return project ? project.name : 'Unknown Project';
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch('/projects');
            if (!response.ok)
                throw new error(`[${response.status}]: ${response.statusText}`)
            const projectData = await response.json();
            setProjects(projectData);
            setSelectedProject(projectData[0])
            return projectData
        } catch (error) {
            console.error("Error fetching projects:", error);
            return null
        }
    };

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

    const fetchTasks = async () => {
        try {
            const response = await fetch('/tasks');
            if (response.ok) {
                const data = await response.json();
                const formattedTasks = Object.fromEntries(
                    data.map(task => [task.id, {
                        id: task.id,
                        completed: task.status,
                        title: task.name,
                        project: getProjectName(task.projectId), // Project names fetched from state
                        dueDate: task.dueDate || 'No Due Date',
                        priority: priorityOrder[task.priority],
                    }])
                )
                setTasks(formattedTasks)
                console.log(formattedTasks)
            } else {
                console.error('Failed to fetch tasks:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const onLoad = async () => {
        if (!(await fetch('/auth')).ok) {
            window.location.replace('/login');
            return;
        }
        const projectData = fetchProjects();
        if (projectData === null)
            return;
        else if (projectData.length === 0)
            return createDefaultProject()
        else
            fetchTasks()
    }

    useEffect(() => {
        onLoad()
    }, []);

    const resetTaskFields = async () => {
        setIsDrawerOpen(true);
        // isEditMode(true);
        // setCurrentTaskTitle('');
        setLastSelectedTask(null);
        // document.getElementById("projects-option").value = 0;
        // document.getElementById("date-option").value = "";
        // document.getElementById("priority-option").value = "Low";
        // document.getElementById("descriptionBox").value = "";
    };

    // const addNewTask = async () => {
    //     const newTask = {
    //         name: currentTaskTitle,
    //         description: document.getElementById('descriptionBox').value,
    //         status: 0,
    //         projectId: +document.getElementById('projects-option').value,
    //         dueDate: document.getElementById('date-option').value,
    //         priority: +document.getElementById('priority-option').value,
    //     };
    //     try {
    //         const response = await fetch('/tasks', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(newTask),
    //         });

    //         if (response.ok) {
    //             const createdTask = await response.json();
    //             const formattedTask = {
    //                 id: createdTask.id,
    //                 completed: 0,
    //                 title: createdTask.name,
    //                 project: createdTask.projectId,
    //                 dueDate: createdTask.dueDate,
    //                 priority: createdTask.priority,
    //             };
    //             console.log(createdTask);
    //             setTasks((prevTasks) => [...prevTasks, formattedTask]);
    //         }
    //     } catch (error) {
    //         console.error('Error adding new task:', error);
    //     }
    //     fetchTasks();
    // };

    // const deleteTask = async (taskId) => {
    //     try {
    //         const trashResponse = await fetch(`/tasks/trash/${taskId}`, {method: 'PUT'});
    //         if (!trashResponse.ok) {
    //             console.error(`Failed to move task ${taskId} to trash: ${trashResponse.statusText}`);
    //             return;
    //         }
    //         await fetchTasks();
    //         console.log(`Task ${taskId} successfully moved to trash.`);
    //     } catch (e) {
    //         console.error(`Error processing task deletion for ${taskId}: ${e.message}`);
    //     }
    // };


    // const deleteTask2 = async (taskId) => {
    //     try {
    //         const trashResponse = await fetch(`/tasks/trash/${taskId}`, { method: 'PUT' });
    //         if (!trashResponse.ok) {
    //             console.error(`Failed to move task ${taskId} to trash: ${trashResponse.statusText}`);
    //             return;
    //         }
    //         setDeletePopup({ isOpen: false, taskId: null });
    //         await fetchTasks();
    //         resetTaskFields();
    //         console.log(`Task ${taskId} successfully moved to trash.`);
    //     } catch (e) {
    //         console.error(`Error deleting task ${taskId}: ${e.message}`);
    //     }
    // };

    // METHOD 2 - SEND ONLY STATUS
    // const toggleTaskCompletion = async (task, currentStatus) => {
    //     const updatedStatus = currentStatus === 1 ? 0 : 1;
    //     try {
    //         const response = await fetch(`/tasks/${task.id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ status: updatedStatus }),
    //         });
    //         if (response.ok) {
    //             setTasks(prevTasks =>
    //                 prevTasks.map(task =>
    //                     task.id === task.id ? { ...task, status: updatedStatus } : task
    //                 )
    //             );
    //         } else {
    //             console.error("Failed to update task completion status:", response.statusText);
    //         }
    //     } catch (error) {
    //         console.error("Error updating task completion status:", error);
    //     }
    // };


    return (
        <>
            <PageTitle title={"My Tasks | Checkmate"}></PageTitle>
            
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
                            My Tasks
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
                        <TaskTable columns={taskColumns}
                                   data={Object.values(tasks).filter(task => (activeTab === "upcoming" ? !task.completed : task.completed))}
                                   onTaskSelect={handleTaskSelect}
                                   />
                    </section>
                </div>
            </div>
        </>
    );
}
