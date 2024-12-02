import { useEffect, useState } from 'react'


import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button.jsx'
import { DialogDemo } from './Dialog'
import { post, put } from '@/lib/taskProjectUtils'


export const TaskSidePanel = ({selectedTask, setTasks, projects, selectedProject}) => {
    const [popupOpen, setPopupOpen] = useState(false)
    const [taskTitle, setTaskTitle] = useState(selectedTask ? selectedTask.name : 'New Task')
   
    function taskFormSubmit(e){
        // Prevent default submit/page reload
        e.preventDefault()

        // Add/edit task function as normal
        addEditTask()
    }

    const getTask = () => {
        return {
            name:           taskTitle,
            description:    document.getElementById('description-box').value,
            status:         selectedTask ? selectedTask.status : 0,
            projectId:     +document.getElementById('projects-option').value,
            dueDate:        document.getElementById('date-option').value,
            priority:      +document.getElementById('priority-option').value,
        }
    }


    const addEditTask = async () => {
        try {
            let response
            if (selectedTask)
                response = await put(`/tasks/${selectedTask.id}`, getTask())
            else
                response = await post('/tasks', getTask())
               
            if (!response.ok)
                throw new Error(`[${response.status}]: ${response.statusText}`)
            const task = await response.json()
            setTasks(tasks => {
                const newTasks = structuredClone(tasks)
                newTasks[task.id] = task
                return newTasks
            })
        } catch (e) {
            console.error('Error adding new task: ', e)
        }
    }


    const onPopupSelect = action => {
        setPopupOpen(false)
        if (action === 'delete')
            deleteTask()
    }


    const deleteTask = async () => {
        if (!selectedTask) {
            console.error('trying to delete non-existent task')  
            return
        }
        try {
            const response = await fetch(`/tasks/trash/${selectedTask.id}`, { method: 'PUT' })
            if (!response.ok)
                throw new Error(`[${response.status}]: ${response.statusText}`)
            setTasks(tasks => {
                const {[selectedTask.id]: _, ...rest} = tasks
                return rest
            })
        } catch (e) {
            console.error('Error deleting task')
        }
    }


    useEffect(() => {
        if (!selectedTask)
            return
        setTaskTitle(selectedTask ? selectedTask.name : 'New Task')
        document.getElementById('description-box').value = selectedTask.description
        document.getElementById('projects-option').value = selectedTask.projectId
        document.getElementById('date-option').value = selectedTask.dueDate
        document.getElementById('priority-option').value = selectedTask.priority
    }, [selectedTask])


    return (
        <>
            <DialogDemo onAction={onPopupSelect} isOpen={popupOpen} />
            <form
            onSubmit={e => taskFormSubmit(e)}
            id="title-option"
            className="mt-6 bg-blueLight w-[340px] fixed top-0 bottom-0 pt-16 shadow-lg right-0 "
        >
            {/* <div className="relative"> */}
                <div className="text-2xl font-semibold mx-4">Task Details</div>


                {/* <div className="flex items-center justify-between"> */}
                    <input
                        required
                        maxLength={96}
                        id="task-title"
                        type="text"
                        value={taskTitle}
                        onChange={e => {setTaskTitle(e.target.value)}}
                        autoFocus
                        placeholder="Task Title"
                        className="w-[300px] mx-4 pl-3 mb-4 mt-4 rounded-md border border-neutral-200 p-1 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white hover:bg-gray-300 transition-colors duration-300 mt-0.5 "
                    />
                {/* </div> */}


                <Label htmlFor="description-box" className="sr-only">Task Description</Label>
                <textarea
                    maxLength={512}
                    id="description-box"
                    placeholder="Description"
                    spellCheck='false'
                    style={{resize: 'none'}}
                    className="flex mx-4 w-[300px] h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
                    // className="flex mx-4 w-[344px] h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
                >
                </textarea>
                <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                    <Label htmlFor="projects-option">Project: </Label>
                    <select
                        id="projects-option"
                        className="w-[206px] p-2 mr-6 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black"
                        defaultValue={selectedProject ? selectedProject.id : ''}
                    >
                        {projects
                            ? projects.map(project => (
                                <option key={project.id} value={project.id} className="flex flex-col">
                                    {project.name}
                                </option>
                            ))
                            : <></>
                        }
                    </select>
                </div>
                <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                    <Label htmlFor="date-option">Due Date: </Label>
                    <input
                        required
                        id="date-option"
                        type="date"
                        className="w-[206px] p-2 mr-6 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black"
                    >
                    </input>
                </div>
                <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                    <Label htmlFor="priority-option">Priority: </Label>
                    <select
                        id="priority-option"
                        className="w-[206px] p-2 mr-6 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black"
                        defaultValue={'2'}
                    >
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                        <option value="0">No Priority</option>
                    </select>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex flex-row-reverse gap-4 mb-8 mx-4 mt-auto">
                    {/* Button submits form instead of calling addEditTask directly (needed for required inputs to work) */}
                    <Button type="submit" variant="default_w_border" >{selectedTask ? 'Save Changes' : 'Add New Task'}</Button>
                    {selectedTask
                        ? <Button variant="outline_destructive" onClick={() => setPopupOpen(true)}>Delete Task</Button>
                        : <></>
                    }
                </div>
            {/* </div> */}
        </form>
        </>
    )
}
