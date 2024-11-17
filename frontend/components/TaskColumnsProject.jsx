// Columns for the Task Table
// Documentation: https://ui.shadcn.com/docs/components/data-table

import { TaskHeaderButton } from '@/components/TaskHeaderButton'

// Columns for TaskTable, accessorKey needs to match ket used in initialTasks/task data
export const taskColumnsProject = [
    {
        accessorKey: "completed",
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
        sortingFns: "alphanumeric",
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
            // Sort by priority 
            const priorities = ["Low", "Medium", "High"];
            const rowAPri = priorities.indexOf(rowA.getValue(columnId))
            const rowBPri = priorities.indexOf(rowB.getValue(columnId))

            return rowAPri < rowBPri ? 1 : rowAPri > rowBPri ? -1 : 0;
        }
    },
]