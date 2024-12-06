import { useContext, useEffect, useState } from 'react'
import { TaskPageContent } from './TaskPage'
import { fetchTasks, formatTasks, ProjectContext } from '@/lib/taskProjectUtils'
import PageTitle from '@/components/PageTitle'
import { TaskTable } from '@/components/TaskTable'
import { taskColumnsDeleted } from '@/components/TaskColumnsDeleted'

export default function RecentlyDeleted() {
    const { projects, trashedProjects } = useContext(ProjectContext)
    const [trashedTasks, setTrashedTasks] = useState({})

    useEffect(() => {
        if (projects == null || projects.length === 0)
            return
        fetchTasks(setTrashedTasks, true)
    }, projects)

    return (
        <>
            <PageTitle title={'Recently Deleted | Checkmate'}/>
            <TaskPageContent pageTitle={'Recently Deleted'}>
                <TaskTable
                    columns={taskColumnsDeleted}
                    data={formatTasks(trashedTasks, projects)}
                    tasks={trashedTasks}
                    setTasks={setTrashedTasks}
                />
            </TaskPageContent>
        </>
    )
}


