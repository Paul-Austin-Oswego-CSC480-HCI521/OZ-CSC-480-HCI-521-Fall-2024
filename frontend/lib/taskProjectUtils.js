import React from 'react'

export const fetchWithJson = async (endpoint, method, payload) => {
    return await fetch(endpoint, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
}
export const post = async (endpoint, payload) => await fetchWithJson(endpoint, 'POST', payload)
export const put = async (endpoint, payload) => await fetchWithJson(endpoint, 'PUT', payload)

export const fetchProjects = async (setProjectsFn, trash) => {
    try {
        const response = await fetch(trash ? '/projects/trash' : '/projects')
        if (!response.ok)
            throw new Error(`[${response.status}]: ${response.statusText}`)
        const projects = await response.json();
        setProjectsFn(projects)
    } catch (error) {
        console.error("Error fetching projects:", error)
    }
}

export const authAndFetchProjects = async (setProjectsFn, setTrashedProjectsFn) => {
    if (!(await fetch('/auth')).ok) {
        if (window.location.pathname !== '/login')
            window.location.replace('/login')
        return;
    }
    fetchProjects(setProjectsFn)
    fetchProjects(setTrashedProjectsFn, true)
}

export const fetchTasks = async (setTasksFn, trash) => {
    try {
        const response = await fetch(trash ? '/tasks/trash' : '/tasks');
        if (!response.ok)
            throw new Error(`[${response.status}]: ${response.statusText}`)
        const tasks = await response.json();
        const taskMap = Object.fromEntries(tasks.map(task => [task.id, task]))
        setTasksFn(taskMap)
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

export const valueToPriority = {
    0: 'No Priority',
    1: 'Low',
    2: 'Medium',
    3: 'High',
}
// swap keys and values
export const priorityToValue = Object.fromEntries(Object.entries(valueToPriority).map(([k, v]) => [v, k]))

export const getProject = (projects, projectId) => projects.find(project => project.id === projectId)

const getProjectName = (projects, projectId) => {
    const project = getProject(projects, projectId)
    return project ? project.name : 'Unknown Project'
}

export const formatTasks = (taskMap, projects, activeTab, selectedProject) => {
    const tableFormatted = Object.values(taskMap)
    .filter(task => selectedProject ? task.projectId === selectedProject.id : true)
    .map(task => {
        return {
            id: task.id,
            completed: task.status === 1,
            title: task.name,
            project: getProjectName(projects, task.projectId),
            dueDate: task.dueDate || 'No Due Date',
            priority: valueToPriority[task.priority],
        }
    })
    if (activeTab)
        return tableFormatted.filter(task => (activeTab === 'upcoming') != task.completed)
    else
        return tableFormatted
}

export const setTaskChecked = async (tasks, setTasks, taskId, checked) => {
    try {
        const updatedTask = {
            ...tasks[taskId],
            status: +checked
        }

        if ((await put(`/tasks/${taskId}`, updatedTask)).ok) {
            setTasks(tasks => {
                const newTasks = structuredClone(tasks)
                newTasks[taskId] = updatedTask
                return newTasks
            })
        }
    } catch (error) {
        console.error("Error updating task completion status:", error);
    }
}

export const restoreTask = async (setTasks, taskId) => {
    if ((await fetch(`/tasks/restore/${taskId}`, { method: 'PUT'})).ok) {
        setTasks(tasks => {
            const {[taskId]: _, ...rest} = tasks
            return rest
        })
    }
}

export const deleteTask = async (setTasks, taskId) => {
    if ((await fetch(`/tasks/${taskId}`,{ method: 'DELETE' })).ok) {
        setTasks(tasks => {
            const {[taskId]: _, ...rest} = tasks
            return rest
        })
    }
}

export const ProjectContext = React.createContext(null)
