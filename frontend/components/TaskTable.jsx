import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
} from "@tanstack/react-table"


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import { Checkbox } from "@/components/ui/checkbox.jsx"
import {Button} from "@/components/ui/button.jsx";


export function TaskTable({
                              columns,
                              data,
                              onTaskSelect,
                              selectedTask,
                              tasks,
                              setTasks
                          }) {
    const [sorting, setSorting] = React.useState([])
    const [highlightedTask, setSelectedTask] = React.useState(selectedTask);


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })


    async function handleCheckChange(checked, taskId) {
        let status = 0;
        if (checked === true) {
            status = 1;
        }
        try {
            let taskToUpdate = tasks[taskId]
            const updatedTask = {
                ...taskToUpdate,
                status: status
            };

            await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });
            setTasks(tasks => {
                const newTasks = structuredClone(tasks)
                newTasks[taskToUpdate.id] = updatedTask
                return newTasks
            })
        } catch (error) {
            console.error("Error updating task completion status:", error);
        }
        return checked;
    }


    const handleRestore = async (taskId) => {
        try {
            await fetch(`/tasks/restore/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error("Error updating task completion status:", error);
        }
        setTasks(tasks => {
            const {[taskId]: _, ...rest} = tasks
            return rest
        })
    }




    function CellContent({ cellContent, cell, taskid }) {
        if (cell.column.columnDef.accessorKey === "completed") {
            return (
                <span className="pl-16 pr-0 flex">
          {flexRender(
              <Checkbox
                  className="w-5 h-5"
                  defaultChecked={cellContent === true}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={(checked) => handleCheckChange(checked, taskid)}
              />,
              cell.getContext()
          )}
        </span>
            )
        }


        if (cell.column.columnDef.accessorKey === "recover") {
            return (
                <span className="">
                {flexRender(
                    <Button onClick={() => handleRestore(taskid)}  className="w-14.5 h-8 m-0 border-0">
                        Recover
                    </Button>
                )}
            </span>
            );
        }


        if (cell.column.columnDef.accessorKey === "dueDate") {
            const dateArray = cellContent.split("-")
            const newDate = dateArray[1] + " / " + dateArray[2] + " / " + dateArray[0]
            return <span>{newDate}</span>
        }
        return (
            <span className="pl-4">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
        )
    }


    return (
        <div className={" mr-[340px]"}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow className={"border-b-transparent"} key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="text-left pl-2">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead> 
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                onClick={() => {
                                setSelectedTask(row.id);
                                onTaskSelect(row.original.id);
                                  }}
                                className={`cursor-pointer hover:bg-gray-100 ${highlightedTask === row.id ? 'bg-gray-100' : ''}`}


                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="pl-2 pr-2">
                                    <CellContent
                                        cellContent={cell.getValue()}
                                        cell={cell}
                                        taskid={row.original.id}
                                    />
                                </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
