import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Sidebar} from "@/components/ui/sidebar";
import {Label} from "@radix-ui/react-label";
import {DialogDemo} from "@/components/Dialog.jsx";

import {TaskTable} from '@/components/TaskTable'
import {taskColumns} from "@/components/TaskColumns";

import {DrawerTrigger, DrawerContent, DrawerTitle, DrawerHeader} from "@/components/ui/drawer";
import { Drawer, Drawer as DrawerPrimitive } from "vaul"
import { faL } from "@fortawesome/free-solid-svg-icons";

import PageTitle from '@/components/PageTitle'

const priorityOrder = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
};

const initialTasks = [
    {
        id: "task-1",
        completed: 0,
        title: "Complete report",
        projectId: "1",
        dueDate: "2024-10-20",
        priority: 1,
    }
];

const initialProjects = [
    {
        description: "this description just got updated",
        id: 1,
        name: "Not my first rodeo"
    }
];

export function TaskPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [projects, setProjects] = useState(initialProjects);
    const [currentTaskTitle, setCurrentTaskTitle] = useState("Task Title");
    const [editMode, isEditMode] = useState(false);
    const [deletePopup, setDeletePopup] = useState({isOpen: false, taskId: null});
    const [activeTab, setActiveTab] = useState("upcoming");
    const [lastSelectedTask, setLastSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    const getProjectName = (projectId) => {
        const project = projects.find(project => project.id === projectId);
        return project ? project.name : 'Unknown Project';
    };




    // const handleDeletePopup = (action, taskId) => {
    //     setDeletePopup({isOpen: false, taskId: null});
    //     if (action === "delete") {
    //         deleteTask2(taskId);
    //     }
    // };

    const handleDeletePopup = (action, taskId) => {
        if (action === "delete") {
            deleteTask2(taskId);
        } else {
            setDeletePopup({ isOpen: false, taskId: null });
        }
    };
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


    const handleTaskSelect = (taskId) => {
        setIsDrawerOpen(true);
        console.log("Task clicked:", taskId);
     const selectedTask = tasks.find(task => task.id === taskId);
     console.log("Selected Task:",selectedTask)
     
     if (!selectedTask) {
         console.error("Task not found");
         return;
     }
        setLastSelectedTask(selectedTask);
        isEditMode(false);


     const descriptionBoxElement = document.getElementById("descriptionBox");
     if (descriptionBoxElement) {
         descriptionBoxElement.value = selectedTask.description || '';
     } else {
         console.error("Element with id 'descriptionBox' not found");
     }


     const projectSelectElement = document.getElementById("projects-option");
     if (projectSelectElement) {
         projectSelectElement.value = selectedTask.projectId || '';
     } else {
         console.error("Element with id 'projects-option' not found");
     }


     const dateElement = document.getElementById("date-option");
     if (dateElement) {
         dateElement.value = selectedTask.dueDate || '';
     } else {
         console.error("Element with id 'date-option' not found");
     }


     const priorityMap = {
        "Low": "1",
        "Medium": "2",
        "High": "3",
        "No Priority": "None"
    };


    const priorityElement = document.getElementById('priority-option');
    if (priorityElement) {
        const priorityValue = priorityMap[selectedTask.priority] || '1';
        priorityElement.value = priorityValue;
    } else {
        console.error("Element with id 'priority-option' not found");
    }




//      setIsDrawerOpen(true);


    }

    const fetchTasks = async () => {
        if (!(await fetch('/auth')).ok) {
            window.location.replace('/login');
            return;
        }
        try {
            const response = await fetch('/tasks');
            if (response.ok) {
                const data = await response.json();
                const formattedTasks = data.map(task => ({
                    id: task.id,
                    completed: task.status,
                    title: task.name,
                    project: getProjectName(task.projectId), // Project names fetched from state
                    dueDate: task.dueDate || 'No Due Date',
                    priority: priorityOrder[task.priority],
                }));
                setTasks(formattedTasks);
            } else {
                console.error('Failed to fetch tasks:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (projects.length > 0) {
            fetchTasks();
            fetchProjects();
        }
    }, [projects.length]);

    const resetTaskFields = async () => {
        setIsDrawerOpen(true);
        isEditMode(true);
        setCurrentTaskTitle('');
        setLastSelectedTask('');
        document.getElementById("projects-option").value = 0;
        document.getElementById("date-option").value = "";
        document.getElementById("priority-option").value = "Low";
        document.getElementById("descriptionBox").value = "";
    };

    const addNewTask = async () => {
        const newTask = {
            name: currentTaskTitle,
            description: document.getElementById('descriptionBox').value,
            status: 0,
            projectId: +document.getElementById('projects-option').value,
            dueDate: document.getElementById('date-option').value,
            priority: +document.getElementById('priority-option').value,
        };
        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                const createdTask = await response.json();
                const formattedTask = {
                    id: createdTask.id,
                    completed: 0,
                    title: createdTask.name,
                    project: createdTask.projectId,
                    dueDate: createdTask.dueDate,
                    priority: createdTask.priority,
                };
                console.log(createdTask);
                setTasks((prevTasks) => [...prevTasks, formattedTask]);
            }
        } catch (error) {
            console.error('Error adding new task:', error);
        }
        fetchTasks();
    };

    const deleteTask = async (taskId) => {
        try {
            const trashResponse = await fetch(`/tasks/trash/${taskId}`, {method: 'PUT'});
            if (!trashResponse.ok) {
                console.error(`Failed to move task ${taskId} to trash: ${trashResponse.statusText}`);
                return;
            }
            await fetchTasks();
            console.log(`Task ${taskId} successfully moved to trash.`);
        } catch (e) {
            console.error(`Error processing task deletion for ${taskId}: ${e.message}`);
        }
    };


    const deleteTask2 = async (taskId) => {
        try {
            const trashResponse = await fetch(`/tasks/trash/${taskId}`, { method: 'PUT' });
            if (!trashResponse.ok) {
                console.error(`Failed to move task ${taskId} to trash: ${trashResponse.statusText}`);
                return;
            }
            setDeletePopup({ isOpen: false, taskId: null });
            await fetchTasks();
            resetTaskFields();
            console.log(`Task ${taskId} successfully moved to trash.`);
        } catch (e) {
            console.error(`Error deleting task ${taskId}: ${e.message}`);
        }
    };

    // SL NOTE: DOES NOT WORK; POSSIBLE BACKEND ISSUE?
    // TWO METHODS - SEND ENTIRE JSON VS SEND ONLY STATUS
    // NEITHER WORKS

    // METHOD 1 - SEND ENTIRE JSON
    // const toggleTaskCompletion = async (task, currentStatus) => {
    //     const updatedStatus = currentStatus === 1 ? 0 : 1;
    //     const updatedTask = {
    //         id: task.id,
    //         completed: updatedStatus,
    //         title: task.name,
    //         project: task.projectId,
    //         dueDate: task.dueDate,
    //         priority: task.priority,
    //     };
    //     try {
    //         const response = await fetch(`/tasks/${task.id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(updatedTask),
    //         });
    //         if (response.ok) {
    //             setTasks(prevTasks =>
    //                 prevTasks.map(t =>
    //                     t.id === task.id ? {...t, completed: updatedStatus} : t
    //                 )
    //             );
    //         } else {
    //             console.error("Failed to update task:", response.status, response.statusText);
    //         }
    //     } catch (error) {
    //         console.error("Error updating task:", error);
    //     }
    // };

    // METHOD 2 - SEND ONLY STATUS
    const toggleTaskCompletion = async (task, currentStatus) => {
        const updatedStatus = currentStatus === 1 ? 0 : 1;
        try {
            const response = await fetch(`/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: updatedStatus }),
            });
            if (response.ok) {
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === task.id ? { ...task, status: updatedStatus } : task
                    )
                );
            } else {
                console.error("Failed to update task completion status:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating task completion status:", error);
        }
    };


    return (
        <>
            <PageTitle title={"My Tasks | Checkmate"}></PageTitle>
            <DialogDemo
                onAction={(action) => handleDeletePopup(action, deletePopup.taskId)}
                isOpen={deletePopup.isOpen}
            />
            {/* <DrawerContent className={`max-w-[417px] bg-blueLight fixed bottom-0 right-0 ml-auto h-full pt-20 pl-4 ${isDrawerOpen ? 'block' : 'hidden'}`}> */}
                {/* <DrawerHeader>
                    <DrawerTitle>Task Details</DrawerTitle>
                </DrawerHeader> */}


                {/* A.D. - Commented out the Drawer changes because it was causing issues w/ selecting tasks*/}
                <Sidebar
                    id="title-option"
                    title={lastSelectedTask ? lastSelectedTask.title : ''}
                    setTitleInParent={setCurrentTaskTitle}
                    editMode={editMode}
                    isEditMode={isEditMode}
                >
                    <Label htmlFor="descriptionBox" className="sr-only">Task Description</Label>
                    <textarea
                        id="descriptionBox"
                        placeholder="Description"
                        spellCheck='false'
                        style={{resize: 'none'}}
                        className="flex mx-4 w-[300px] h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
                        // className="flex mx-4 w-[344px] h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
                    >
                    </textarea>
                    <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                        <Label htmlFor="projects-option">Project: </Label>
                        <select
                            id="projects-option"
                            className="w-[263px] p-2 mr-6 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black"
                        >
                            <option value="" disabled selected onClick={fetchProjects}>Select an option</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id} className="flex flex-col">
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                        <Label htmlFor="date-option">Due Date: </Label>
                        <input
                            id="date-option"
                            type="date"
                            className=" w-[263px] mr-6 flex h-10 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                        >
                        </input>
                    </div>
                    <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                        <Label htmlFor="priority-option">Priority: </Label>
                        <select
                            id="priority-option"
                            className="w-[263px] p-2 mr-6 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black"
                        >
                            <option value="" disabled selected>Select an option</option>
                            <option value="1">Low</option>
                            <option value="2">Medium</option>
                            <option value="3">High</option>
                            <option value="None">No Priority</option>
                        </select>
                    </div>
                    <div className="fixed bottom-4 flex gap-4 ml-10">
                        <Button variant="outline_destructive" onClick={() => setDeletePopup({ isOpen: true, taskId: lastSelectedTask.id })}>Delete Task</Button>
                        <Button variant="default" onClick={addNewTask}>Save Changes</Button>
                    </div>
                </Sidebar>
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
                                    onClick={() => handleTabClick("upcoming")}
                                >
                                    Upcoming
                                </button>
                                <button
                                    className={`text-[16px] font-semibold ${activeTab === 'completed' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                                    onClick={() => handleTabClick("completed")}
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
                                   data={tasks.filter(task => (activeTab === "upcoming" ? !task.completed : task.completed))}
                                   onTaskSelect={handleTaskSelect}
                                   />
                    </section>
                </div>
            </div>
        </>
    );
}
