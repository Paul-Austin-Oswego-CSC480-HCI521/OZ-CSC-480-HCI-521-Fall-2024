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

export function TaskTable({
                              columns,
                              data,
                              onTaskSelect,
                          }) {
    const [sorting, setSorting] = React.useState([])

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

    const handleCheckChange = async (checked, taskID) => {
        let updatedVal = 0;
        if (checked === true) {
            updatedVal = 1;
        }
        try {
            const response = await fetch(`/tasks/${taskID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({status: updatedVal}),
            });

            if (response.ok) {
                console.log("ok")
            }
        } catch (error) {
            console.error("Error updating task completion status:", error);
        }
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
                  onCheckedChange={(checked) => handleCheckChange(checked, taskid)} // Pass taskid here
              />,
              cell.getContext()
          )}
        </span>
            )
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
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                onClick={() => onTaskSelect(row.original.id)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
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
