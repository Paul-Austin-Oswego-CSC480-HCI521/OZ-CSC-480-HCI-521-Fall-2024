import { useEffect, useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button.jsx';
import { DialogDemo } from './Dialog';
import { post, put } from '@/lib/taskProjectUtils';

export const TaskSidePanel = ({ selectedTask, setTasks, projects, selectedProject, setIsDrawerOpen, setLastSelectedTask }) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('2');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskProjectId, setTaskProjectId] = useState('');

    useEffect(() => {
        if (selectedTask) {
            // Set the fields for editing an existing task
            setTaskTitle(selectedTask.name || '');
            setTaskDescription(selectedTask.description || '');
            setTaskPriority(selectedTask.priority != null ? selectedTask.priority.toString() : '2');
            setTaskDueDate(selectedTask.dueDate || '');
            setTaskProjectId(selectedTask.projectId != null ? selectedTask.projectId.toString() : '');
        } else {
            // Reset form fields for a new task
            resetFormFields();
        }
    }, [selectedTask]);

    useEffect(() => {
        if (!selectedTask && projects?.length > 0) {
            setTaskProjectId(selectedProject ? selectedProject.id.toString() : projects[0].id.toString());
        }
    }, [projects, selectedProject, selectedTask]);

    function taskFormSubmit(e) {
        e.preventDefault();
        addEditTask();
    }

    const getTask = () => {
        return {
            name: taskTitle,
            description: taskDescription,
            status: selectedTask ? selectedTask.status : 0,
            projectId: +taskProjectId,
            dueDate: taskDueDate,
            priority: +taskPriority,
        };
    };

    const addEditTask = async () => {
        try {
            let response;
            if (selectedTask) {
                response = await put(`/tasks/${selectedTask.id}`, getTask());
            } else {
                response = await post('/tasks', getTask());
            }

            if (!response.ok) throw new Error(`[${response.status}]: ${response.statusText}`);

            const task = await response.json();
            setTasks((tasks) => {
                const newTasks = structuredClone(tasks);
                newTasks[task.id] = task;
                return newTasks;
            });

            // After saving changes, reset the form fields and set selectedTask to null
            resetFormFields();
            setLastSelectedTask(null);
            setIsDrawerOpen(false); 
        } catch (e) {
            console.error('Error adding/editing task: ', e);
        }
    };

    const resetFormFields = () => {
        setTaskTitle('');
        setTaskDescription('');
        setTaskPriority('2');
        setTaskDueDate('');
        setTaskProjectId(selectedProject ? selectedProject.id.toString() : '');
    };

    const onPopupSelect = (action) => {
        setPopupOpen(false);
        if (action === 'delete') deleteTask();
    };

    const deleteTask = async () => {
        if (!selectedTask) {
            console.error('Trying to delete non-existent task');
            return;
        }
        try {
            const response = await fetch(`/tasks/trash/${selectedTask.id}`, { method: 'PUT' });
            if (!response.ok) throw new Error(`[${response.status}]: ${response.statusText}`);

            // Update the tasks state after deleting the task
            setTasks((tasks) => {
                const { [selectedTask.id]: _, ...rest } = tasks;
                return rest;
            });

            // Reset the form fields and set the selected task to null to clear the panel
            setLastSelectedTask(null);
            resetFormFields();
            setIsDrawerOpen(false); 

        } catch (e) {
            console.error('Error deleting task', e);
        }
    };

    return (
        <>
            <DialogDemo onAction={onPopupSelect} isOpen={popupOpen} />
            <form
                onSubmit={(e) => taskFormSubmit(e)}
                id="task-form"
                className="mt-6 bg-blueLight w-[340px] fixed top-0 bottom-0 pt-16 shadow-lg right-0"
            >
                <div className="text-2xl font-semibold mx-4">Task Details</div>

                <input
                    required
                    maxLength={96}
                    id="task-title"
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    autoFocus
                    placeholder="Task Title"
                    className="w-[300px] mx-4 pl-3 mb-4 mt-4 rounded-md border border-neutral-200 p-1 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white hover:bg-gray-300 transition-colors duration-300"
                />

                <Label htmlFor="description-box" className="sr-only">
                    Task Description
                </Label>
                <textarea
                    maxLength={512}
                    id="description-box"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Description"
                    spellCheck="false"
                    style={{ resize: 'none' }}
                    className="flex mx-4 w-[300px] h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white placeholder:text-neutral-500 mb-4"
                />

                <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                    <Label htmlFor="projects-option">Project: </Label>
                    <select
                        id="projects-option"
                        value={taskProjectId}
                        onChange={(e) => setTaskProjectId(e.target.value)}
                        className="w-[206px] p-2 mr-6 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black"
                        required
                    >
                        {projects &&
                            projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                    <Label htmlFor="date-option">Due Date: </Label>
                    <input
                        required
                        id="date-option"
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="w-[206px] p-2 mr-6 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>

                <div className="flex content-center justify-between items-center gap-2 mx-4 mb-4">
                    <Label htmlFor="priority-option">Priority: </Label>
                    <select
                        id="priority-option"
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="w-[206px] p-2 mr-6 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black"
                        required
                    >
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                        <option value="0">No Priority</option>
                    </select>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex flex-row-reverse gap-4 mb-8 mx-4 mt-auto">
                    <Button type="submit" variant="default_w_border">
                        {selectedTask ? 'Save Changes' : 'Add New Task'}
                    </Button>
                    {selectedTask && (
                        <Button variant="outline_destructive" onClick={() => setPopupOpen(true)}>
                            Delete Task
                        </Button>
                    )}
                </div>
            </form>
        </>
    );
};
