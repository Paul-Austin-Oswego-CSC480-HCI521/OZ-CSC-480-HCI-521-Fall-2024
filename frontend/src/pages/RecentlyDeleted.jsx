import React, {useEffect, useState} from "react";
import {DialogDemo} from "@/components/Dialog.jsx";

import {TaskTable} from '@/components/TaskTable'
import { taskColumns } from "@/components/TaskColumns";
import {DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer.jsx";

import PageTitle from "@/components/PageTitle";

// Initial tasks for test data
const priorityOrder = {
    Low: 1,
    Medium: 2,
    High: 3,
};

const initialTasks = [
    {
        id: "task-1",
        completed: 0,
        title: "Complete report",
        projectId: "1",
        dueDate: "2024-10-20",
        priority: 0,
    }
];

const initialProjects = [
    {
        description: "this description just got updated",
        id: 1,
        name: "Not my first rodeo"
    }
];

export default function RecentlyDeleted() {
    const [tasks, setTasks] = useState(initialTasks);
    const [projects, setProjects] = useState(initialProjects);
    const [sortConfig, setSortConfig] = useState({key: null, direction: "asc"});
    const [currentTaskTitle, setCurrentTaskTitle] = useState("Task Title");
    const [editMode, isEditMode] = useState(false);
    const [deletePopup, setDeletePopup] = useState({isOpen: false, taskId: null});
    const [activeTab, setActiveTab] = useState("upcoming");

    // console.log(tasks);
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const getProjectName = (projectId) => {
        const project = projects.find(project => project.id === projectId);
        return project ? project.name : 'Unknown Project';
    };


    const handleDeletePopup = (action, taskId) => {
        setDeletePopup({isOpen: false, taskId: null});
        if (action === "delete") {
            deleteTask(taskId);
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (!(await fetch('/auth')).ok) {
                    window.location.replace('/login');
                    return;
                }

                const response = await fetch(`/tasks/trash/`);
                if (response.ok) {
                    const data = await response.json();
                    const formattedTasks = data.map(task => ({
                        id: task.id,
                        completed: task.status === 1,
                        title: task.name,
                        project: task.projectId,
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


    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/tasks/${taskId}`, {method: 'DELETE'});
            if (response.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } else {
                console.log(`Error deleting task ${taskId}`);
            }
        } catch (e) {
            console.error(e.message);
        }
    };


    return (
        <>
            <PageTitle title={"Recently Deleted | Checkmate"}></PageTitle>
            <DialogDemo
                onAction={(action) => handleDeletePopup(action, deletePopup.taskId)}
                isOpen={deletePopup.isOpen}
            />

            {/* Main Content */}
            <div className="bg-white pt-5 pb-5 w-full">
                <div className="flex flex-col gap-[32px]">
                    <div className="flex flex-col gap-[32px]">
                        <h1 className="text-left text-[48px] font-bold pl-20 pr-20">
                            Recently Deleted
                        </h1>
                    </div>
                    <section>
                        <TaskTable columns={taskColumns} projects={projects}
                                   data={tasks}/>
                    </section>
                </div>
            </div>
        </>
    );
}


