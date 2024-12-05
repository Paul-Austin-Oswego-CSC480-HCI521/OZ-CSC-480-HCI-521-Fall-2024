import React, { useEffect, useState } from 'react'
import { authAndFetchProjects, post, ProjectContext } from '@/lib/taskProjectUtils'
import { useLocation } from 'react-router-dom'

export default function ProjectProvider({children}) {
    const [projects, setProjects] = useState(null)
    const [trashedProjects, setTrashedProjects] = useState(null);
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
        authAndFetchProjects(setProjects, setTrashedProjects)
    }, [location])

    useEffect(() => {
        if (projects == null)
            return
        if (projects.length === 0)
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

    const trashProject = async projectID => {
        try {
            const response = await fetch(`/projects/trash/${projectID}`, { method: 'PUT' });
            if (response.ok) {
                const trashedProject = projects.find(project => project.id === projectID);
                
                setProjects(prevProjects => prevProjects.filter(project => project.id !== projectID));
                
                if (trashedProject) {
                    setTrashedProjects(prevTrashed => [...prevTrashed, trashedProject]);
                }
    
                if (window.location.pathname === `/project/${projectID}`) {
                    window.location.replace('/');
                }
            } else {
                console.log(`Error trashing project ${projectID}`);
            }
        } catch (e) {
            console.error(e.message);
        }
    };

    const restoreProject = async projectID => {
        try {
            const response = await fetch(`/projects/restore/${projectID}`, { method: 'PUT' });
            if (response.ok) {
                const restoredProject = trashedProjects.find(project => project.id === projectID);

                setTrashedProjects(prevTrashed => prevTrashed.filter(project => project.id !== projectID));

                if (restoredProject) {
                    setProjects(prevProjects => [...prevProjects, restoredProject]);
                }

                //remove from trashed list
            } else {
                console.log(`Error restoring project ${projectID}`);
            }
        } catch (e) {
            console.error(e.message);
        }
    };

    return (
        <ProjectContext.Provider value={{ projects, deleteProject, addProject, trashProject, restoreProject }}>
            {children}
        </ProjectContext.Provider>
    )
}