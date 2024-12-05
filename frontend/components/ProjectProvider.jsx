import React, { useEffect, useState } from 'react'
import { authAndFetchProjects, post, ProjectContext } from '@/lib/taskProjectUtils'
import { useLocation } from 'react-router-dom'

export default function ProjectProvider({children}) {
    const [projects, setProjects] = useState(null)
    const location = useLocation()

    const createDefaultProject = async () => {
        try {
            const response = await post('/projects', {name: 'Default Project' })
            if (!response.ok)
                throw new Error(`[${response.status}] ${response.statusText}`)
            const project = await response.json()
            setProjects([project])
        } catch (e) {
            console.error('Error creating default project: ', e)
        }
    }

    useEffect(() => {
        authAndFetchProjects(setProjects)
    }, [location])

    useEffect(() => {
        if (projects == null)
            return
        if (projects.length == 0)
            createDefaultProject()
    }, [projects])

    const addProject = async projectName => {
        const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1
        const name = projectName ? projectName : `Project ${nextId}`
        const response = await post('/projects', { name })
        if (response.ok) {
            const newProject = await response.json()
            console.log('Created new project:', newProject)
            setProjects(prevProjects => [...prevProjects, newProject])
        } else {
            console.log('POST /projects failed to respond')
        }
    };

    const deleteProject = async projectID => {
        try {
            const response = await fetch(`/projects/${projectID}`, {method: 'DELETE'})
            if (response.ok) {
                setProjects(prevTasks => prevTasks.filter(projects => projects.id !== projectID))
                if (window.location.pathname == `/project/${projectID}`)
                    window.location.replace('/')
            } else {
                console.log(`Error deleting task ${projectID}`)
            }
        } catch (e) {
            console.error(e.message)
        }
    };

    return (
        <ProjectContext.Provider value={{ projects, deleteProject, addProject }}>
            {children}
        </ProjectContext.Provider>
    )
}