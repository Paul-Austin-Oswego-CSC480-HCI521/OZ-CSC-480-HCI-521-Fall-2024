import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox.jsx";

const priorityOrder = {
    Low: 1,
    Medium: 2,
    High: 3,
};

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
        completed: true,
        title: "Team meeting",
        project: "Internal",
        dueDate: "2024-10-19",
        priority: "Low",
    },
];

export function TaskPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const handleSort = (key) => {
        let direction = "asc";

        // Toggle direction if the same key is being sorted
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        setSortConfig({ key, direction });

        const sortedTasks = [...tasks].sort((a, b) => {
            if (key === "priority") {
                if (direction === "asc") {
                    if (priorityOrder[a.priority] < priorityOrder[b.priority]) {
                        return -1;
                    }
                    if (priorityOrder[a.priority] > priorityOrder[b.priority]) {
                        return 1;
                    }
                } else {
                    if (priorityOrder[a.priority] > priorityOrder[b.priority]) {
                        return -1;
                    }
                    if (priorityOrder[a.priority] < priorityOrder[b.priority]) {
                        return 1;
                    }
                }
                return 0;
            }

            if (direction === "asc") {
                if (a[key] < b[key]) {
                    return -1;
                }
                if (a[key] > b[key]) {
                    return 1;
                }
            } else {
                if (a[key] > b[key]) {
                    return -1;
                }
                if (a[key] < b[key]) {
                    return 1;
                }
            }
            return 0;
        });

        setTasks(sortedTasks);
    };


    return (
        <div className="bg-white rounded-lg shadow mx-auto max-w-4xl p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
                My Tasks
            </h1>
            <br />
            <hr />
            <br />
            <div className="text-center mb-4">
                <Button>Create New Task</Button>
            </div>

            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="px-4 py-2 text-center">
                        <span className="flex items-center justify-center">Completed?</span>
                    </th>
                    <th className="px-4 py-2 text-center">
                            <span className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("title")}>
                                Task <CaretSortIcon className="ml-1" />
                            </span>
                    </th>
                    <th className="px-4 py-2 text-center">
                            <span className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("project")}>
                                Project <CaretSortIcon className="ml-1" />
                            </span>
                    </th>
                    <th className="px-4 py-2 text-center">
                            <span className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("dueDate")}>
                                Due Date <CaretSortIcon className="ml-1" />
                            </span>
                    </th>
                    <th className="px-4 py-2 text-center">
                            <span className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("priority")}>
                                Priority <CaretSortIcon className="ml-1" />
                            </span>
                    </th>
                    <th className="px-4 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} className="border-b last:border-b-0">
                        <td className="px-4 py-2 text-center">
                            <Checkbox id={`task-${task.id}`} checked={task.completed} />
                        </td>
                        <td className="px-4 py-2 text-center">{task.title}</td>
                        <td className="px-4 py-2 text-center">{task.project}</td>
                        <td className="px-4 py-2 text-center">{task.dueDate}</td>
                        <td className="px-4 py-2 text-center">{task.priority}</td>
                        <td className="px-4 py-2 text-center">
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
