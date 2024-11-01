import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Sidebar } from "@/components/ui/sidebar";
import { Label } from "@radix-ui/react-label";

import {TaskTable} from '@/components/TaskTable'
import { taskColumns } from "@/components/TaskColumns";

// Initial tasks for test data
// TODO swap TaskTable data to data fetched from DB
const initialTasks = [
    {
        id: "task-1",
        completed: false,
        title: "Complete report",
        project: "Office Work",
        dueDate: "2024-10-20",
        priority: "High",
    },
    {
        id: "task-2",
        completed: false,
        title: "Design homepage",
        project: "Web Development",
        dueDate: "2024-10-22",
        priority: "Medium",
    },
    {
        id: "task-3",
        completed: false,
        title: "Team meeting",
        project: "Internal",
        dueDate: "2024-10-19",
        priority: "Low",
    },
    {
        id: "task-4",
        completed: false,
        title: "Zebra safari",
        project: "Internal",
        dueDate: "2024-10-01",
        priority: "Medium",
    },
    {
        id: "task-5",
        completed: false,
        title: "Apple picking",
        project: "Internal",
        dueDate: "2024-11-01",
        priority: "Low",
    },
    {
        id: "task-6",
        completed: false,
        title: "Meet with CEO",
        project: "Internal",
        dueDate: "2024-12-01",
        priority: "High",
    },
];

export function TaskPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [currentTaskTitle, setCurrentTaskTitle] = useState("Task Title");
    const [editMode, isEditMode] = useState(false);

    useEffect(() => {
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
                        completed: task.status === 1,
                        title: task.name,
                        project: `Project ${task.project_id}`,
                        dueDate: task.dueDate || 'No Due Date',
                        priority: task.priority || 'Medium',
                    }));
                    setTasks(formattedTasks);
                } else {
                    console.error('Failed to fetch tasks:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const resetTaskFields = async () => {
        isEditMode(true);
        setCurrentTaskTitle('');
        document.getElementById("projects-option").value = "option1";
        document.getElementById("date-option").value = "";
        document.getElementById("priority-option").value = "Low";
        document.getElementById("repeat-option").value = "Never";
        document.getElementById("descriptionBox").value = "";
    };

    const addNewTask = async () => {
        const newTask = {
            name: currentTaskTitle,
            description: document.getElementById('descriptionBox').value,
            status: 1,
            project_id: 7,
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
                    completed: createdTask.status === 1,
                    title: createdTask.name,
                    project: `Project ${createdTask.project_id}`,
                    dueDate: "TBD",
                    priority: "Medium",
                };
                setTasks((prevTasks) => [...prevTasks, formattedTask]);
            }
        } catch (error) {
            console.error('Error adding new task:', error);
        }
    };

    return (
        <>
                {/* Right side bar */}
                <Sidebar
                    id="title-option"
                    title={currentTaskTitle}
                    setTitleInParent={setCurrentTaskTitle}
                    editMode={editMode}
                    isEditMode={isEditMode}
                >
                    <select
                        id="projects-option"
                        className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                    >
                        <option value="option1">Project 1</option>
                        <option value="option2">Project 2</option>
                        <option value="option3">Project 3</option>
                        <option value="option1">No Project</option>
                    </select>

                    <input
                        id="date-option"
                        type="date"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 mb-4"
                    >
                    </input>


                    <select
                        id="repeat-option"
                        className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                    >
                        <option value="Never">Repeats Never</option>
                        <option value="option2">To be determined</option>
                        <option value="option3">To be determined</option>
                        <option value="option1">To be determined</option>
                    </select>

                    <select
                        id="priority-option"
                        className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="None">No Priority</option>
                    </select>


                    <Label htmlFor="password"><b>Task Description</b></Label>
                    <textarea
                        id="descriptionBox"
                        placeholder="Describe your task here..."
                        spellCheck='false'
                        style={{resize: 'none'}}
                        className="flex w-full h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
                    >
               </textarea>
                    <div className="flex justify-end mb-4">
                        <Button variant="default2" onClick={addNewTask}>Save Changes</Button>
                    </div>
                </Sidebar>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow mx-auto max-w-4xl p-6">
                <h1 className="text-left pb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    My Tasks
                </h1>
                <hr />
                <div className="text-left my-6">
                    <Button onClick={resetTaskFields}>Create New Task</Button>
                </div>

                {/* Tasks Table */}
                {/* TODO Change data to data fetched from /tasks */}
                <TaskTable columns={taskColumns} data={initialTasks}/>
            </div>
        </>
    );
}
