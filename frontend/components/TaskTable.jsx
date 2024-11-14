// Table for tasks
// Documentation: https://ui.shadcn.com/docs/components/data-table
// TODO Handle completed tasks when checkbox checked
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
   
import { Checkbox } from "@/components/ui/checkbox.jsx";

export function TaskTable({
    columns,
    data,
    projects
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

    function handleCheckChange(checked){
        // TODO Handle completed tasks when checkbox checked
        // console.log("checked changed to", checked)
        return checked;
    }

    function CellContent({cellContent, cell}){
        if(cell.column.columnDef.accessorKey==="completed"){
            return(
                <span className="pl-16 pr-0">
                    { flexRender(<Checkbox defaultChecked={cellContent===true} onCheckedChange={(checked)=>handleCheckChange(checked)}/>, cell.getContext()) }
                </span>
            )
        }
        if(cell.column.columnDef.accessorKey==="project") {
          const selectedProject = projects.find(project => cellContent === project.id)
          return(
            <span>
              {selectedProject ? selectedProject.name : "Project not found"}
            </span>
          )
        }
        if(cell.column.columnDef.accessorKey==="dueDate") {
          const dateArray = cellContent.split('-')
          const newDate = dateArray[1]+" / "+dateArray[2]+" / "+dateArray[0]
          return(
            <span>
             {newDate}
            </span>
          )
        }
        return (
            <span className="pl-4">
                { flexRender(cell.column.columnDef.cell, cell.getContext())} 
            </span>
        )

    }
   
    return (
      <div className={" mr-[340px]"}>
        <Table >
          <TableHeader >
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        <CellContent cellContent={cell.getValue()} cell={cell}/> 
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
