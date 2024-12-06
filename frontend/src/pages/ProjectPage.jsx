import { useParams } from 'react-router-dom'
import { TaskPageContent, TaskPageHeaders } from './TaskPage'
import { useContext, useEffect, useState } from 'react'
import { fetchTasks, formatTasks, ProjectContext, setTaskChecked } from '@/lib/taskProjectUtils'
import PageTitle from '@/components/PageTitle'
import { TaskSidePanel } from '@/components/TaskSidePanel'
import { TaskTable } from '@/components/TaskTable'
import { taskColumnsProject } from '@/components/TaskColumnsProject'

export default function ProjectPage() {
    const { projectID } = useParams()
    const { projects } = useContext(ProjectContext)
    const [activeTab, setActiveTab] = useState('upcoming')
    const [tasks, setTasks] = useState({})
    const [pageTitle, setPageTitle] = useState(`Project ${projectID}`)
    const [selectedProject, setSelectedProject] = useState(null)
    const [lastSelectedTask, setLastSelectedTask] = useState(null)

    useEffect(() => {
        if (projects == null || projects.length === 0)
            return

        const p = projects.find(project => project.id === +projectID)
        if (p) {
            setPageTitle(p.name)
            setSelectedProject(p)
        } else
            console.error('TODO: replace with 404')
        
        fetchTasks(setTasks)
    }, [projects, projectID])

    return (
        <>
            <PageTitle title={`${pageTitle} | Checkmate`}/>
            <TaskSidePanel
                selectedTask={lastSelectedTask}
                setTasks={setTasks}
                projects={projects}
                selectedProject={selectedProject}
            />
            <TaskPageContent pageTitle={pageTitle} headers={
                <TaskPageHeaders activeTab={activeTab} setActiveTab={setActiveTab} onCreateTask={() => setLastSelectedTask(null)}/>
            }>
                <TaskTable
                    columns={taskColumnsProject}
                    data={formatTasks(tasks, projects, activeTab, selectedProject)}
                    onTaskSelect={taskId => setLastSelectedTask(tasks[taskId])}
                    selectedTask={lastSelectedTask}
                    setChecked={(checked, taskId) => setTaskChecked(tasks, setTasks, taskId, checked)}
                />
            </TaskPageContent>
        </>
    )
}
