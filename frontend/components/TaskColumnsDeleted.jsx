// Columns for the Task Table
// Documentation: https://ui.shadcn.com/docs/components/data-table

import { TaskHeaderButton } from '@/components/TaskHeaderButton'
import { priorityToValue } from '@/lib/taskProjectUtils'

// Columns for TaskTable, accessorKey needs to match ket used in initialTasks/task data
export const taskColumnsDeleted = [
    {
        accessorKey: "padding-left",
        header: "",
        sortingFns: "basic",
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <TaskHeaderButton column={column} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Task Name</TaskHeaderButton>
            )
        },
        sortingFn: (rowA, rowB) => {
            const nameA = rowA.getValue('title').toLowerCase();
            const nameB = rowB.getValue('title').toLowerCase();
            return nameA.localeCompare(nameB);
        },
    },
    {
        accessorKey: "project",
        header: ({ column }) => {
            return (
                <TaskHeaderButton column={column} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Project</TaskHeaderButton>
            )
        },
        sortingFns: "alphanumericCaseSensitive",
    },
    {
        accessorKey: "dueDate",
        header: ({ column }) => {
            return (
                <TaskHeaderButton column={column} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Due Date</TaskHeaderButton>
            )
        },
        sortingFns: "datetime"
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {
            return (
                <TaskHeaderButton column={column} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Priority</TaskHeaderButton>
            )
        },
        sortingFn: (
            rowA, rowB, columnId
        ) => {
            return priorityToValue[rowA.getValue(columnId)] - priorityToValue[rowB.getValue(columnId)];
        }
    },
    {
        accessorKey: "recover",
        header: "",
    }
]
