import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Sidebar} from "@/components/ui/sidebar";
import {Label} from "@radix-ui/react-label";
import {Trash2} from "lucide-react";
import {CaretSortIcon} from "@radix-ui/react-icons";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import '../styles/dropdown.css';
import {DialogDemo} from "@/components/Dialog.jsx";
import {useParams} from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import {DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer.jsx";
import {TaskTable} from "@/components/TaskTable.jsx";
import {taskColumnsProject} from "@/components/TaskColumnsProject.jsx";

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
        description: "This description just got updated",
        id: 1,
        name: "Not my first rodeo"
    }
];

export default function ProjectPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [projects, setProjects] = useState(initialProjects);
    const [currentTaskTitle, setCurrentTaskTitle] = useState("Task Title");
    const [editMode, isEditMode] = useState(false);
    const [deletePopup, setDeletePopup] = useState({isOpen: false, taskId: null});
    const [currentProject, setCurrentProject] = useState(null);
    const [activeTab, setActiveTab] = useState("upcoming");
    let {projectID} = useParams();
    projectID = +projectID;

    const fetchTasks = async () => {
        try {
            if (!(await fetch('/auth')).ok) {
                window.location.replace('/login');
                return;
            }

            const response = await fetch(`/tasks`);
            if (response.ok) {
                const data = await response.json();
                const formattedTasks = data.map(task => ({
                    id: task.id,
                    completed: task.status,
                    title: task.name,
                    projectId: task.projectId,
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
        fetchTasks();
    }, [projectID]);

    useEffect(() => {
        const selectedProject = projects.find(project => project.id === projectID);
        setCurrentProject(selectedProject || {name: "Unknown Project"});
    }, [projects, projectID]);


    const handleDeletePopup = (action, taskId) => {
        setDeletePopup({isOpen: false, taskId: null});
        if (action === "delete") {
            deleteTask(taskId);
        }
    };

    const resetTaskFields = () => {
        isEditMode(true);
        setCurrentTaskTitle('');
        document.getElementById("projects-option").value = "1";
        document.getElementById("date-option").value = "";
        document.getElementById("priority-option").value = "Low";
        document.getElementById("repeat-option").value = "Never";
        document.getElementById("descriptionBox").value = "";
    };

    const addNewTask = async () => {
        const newTask = {
            name: currentTaskTitle,
            description: document.getElementById('descriptionBox').value,
            status: 0,
            projectId: +document.getElementById('projects-option').value,
            dueDate: document.getElementById('date-option').value,
            priority: document.getElementById('priority-option').value,
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
                    completed: createdTask.status,
                    title: createdTask.name,
                    projectId: createdTask.projectId,
                    dueDate: createdTask.dueDate,
                    priority: createdTask.priority,
                };
                setTasks((prevTasks) => [...prevTasks, formattedTask]);
                fetchTasks();
            }
        } catch (error) {
            console.error('Error adding new task:', error);
        }
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

    const filteredTasks = tasks.filter(task => task.projectId === projectID);

    return (
        <>
            <PageTitle title={currentProject?.name + " | Checkmate"}></PageTitle>
            <DialogDemo
                onAction={(action) => handleDeletePopup(action, deletePopup.taskId)}
                isOpen={deletePopup.isOpen}
            />
                <Sidebar
                    id="title-option"
                    title={currentTaskTitle}
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
                        className="flex mx-4 w-[344px] h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
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
                    <div className="fixed right-4 bottom-4">
                        <Button variant="default" onClick={addNewTask}>Save Changes</Button>
                    </div>
                </Sidebar>


            {/* Main Content */}
            <div className="bg-white pt-5 pb-5 w-full">

                <div className="flex flex-col gap-[32px]">
                    <div className="flex flex-col gap-[32px]">
                        {/* Tab Buttons for Upcoming and Completed */}
                        <div className="flex flex-col gap-[32px]">
                            <h1 className="text-left text-[48px] font-bold pl-20 pr-20">
                                {currentProject?.name}
                            </h1>
                        </div>
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
                        <TaskTable columns={taskColumnsProject}
                                   data={filteredTasks.filter(task => (activeTab === "upcoming" ? !task.completed : task.completed))}/>
                    </section>
                </div>
            </div>
        </>
    );
}
