import React, {useState} from "react";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import { Sidebar } from "@/components/ui/sidebar";
import { Label } from "@radix-ui/react-label";


export function TaskPage() {
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState('')

    const addTask = () => {
        if (newTask.trim() !== '') {
            setTasks([...tasks, {id: Date.now(), text: newTask, done: false, archived: false}])
            setNewTask('')
        }
    }

    const toggleDone = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? {...task, done: !task.done} : task
        ))
    }

    const archiveTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? {...task, archived: true} : task
        ))
    }

    return (
        <>
        <div className = 'flex h-screen'>
            <div className='flex flex-col items-center justify-center h-screen gap-16 flex-1'>
                <h1 className='text-center text-8xl'>Hello, World!</h1>
                <p className='text-2xl'>This uses React, Vite, Tailwind CSS, and Shadcn (JS version)</p>

                <div className='flex w-full max-w-md gap-2'>
                    <Input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Enter a new task"
                        className="flex-grow"
                    />
                    <Button onClick={addTask}>Add Task</Button>
                </div>

                < div className='w-full max-w-2xl'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Task</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.filter(task => !task.archived).map(task => (
                                <TableRow key={task.id}>
                                    <TableCell className={task.done ? 'line-through text-gray-500' : ''}>
                                        {task.text}
                                    </TableCell>
                                    <TableCell>{task.done ? 'Completed' : 'Pending'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="icon"
                                            variant={task.done ? "default" : "outline"}
                                            onClick={() => toggleDone(task.id)}
                                            className="mr-2"
                                        >
                                            <CheckIcon className="h-4 w-4"/>
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => archiveTask(task.id)}
                                        >
                                            <ArchiveIcon className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Sidebar title={"Test Title"}>
            <select
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    <option value="option1">Project 1</option>
                    <option value="option2">Project 2</option>
                    <option value="option3">Project 3</option>
                    <option value="option1">No Project</option>
                </select>


                <input
                type="date"
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 mb-4"
                >
                </input>


                <select
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    <option value="option1">Repeats Never</option>
                    <option value="option2">To be determined</option>
                    <option value="option3">To be determined</option>
                    <option value="option1">To be determined</option>
                </select>


                <Input
                className ='mb-4'
                placeholder="Enter tags separated by commas">
                </Input>


                <select
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    <option value="option1">Low</option>
                    <option value="option2">Medium</option>
                    <option value="option3">High</option>
                    <option value="option1">No Priority</option>
                </select>


                <Label htmlFor="password"><b>Task Description</b></Label>
               <textarea
               placeholder="Describe your task here..."
               spellCheck ='false'
               style={{ resize: 'none' }}
               className="flex w-full h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
               >
               </textarea>
               <div className="flex justify-end mb-4">
               <Button variant="default2">Save Changes</Button>
               </div>
 
            </Sidebar>
         </div>
        </>
    )
}


