import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckIcon, ArchiveIcon } from '@radix-ui/react-icons'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Component() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, done: false, archived: false }])
      setNewTask('')
    }
  }

  const toggleDone = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ))
  }

  const archiveTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, archived: true } : task
    ))
  }

  return ( <div className='flex flex-col items-center justify-center h-screen gap-16'>
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

      <div className='w-full max-w-2xl'>
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
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => archiveTask(task.id)}
                  >
                    <ArchiveIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}