import { useContext, useEffect, useState } from 'react'
import { TaskPageContent } from './TaskPage'
import { deleteTask, fetchTasks, formatTasks, ProjectContext, restoreTask } from '@/lib/taskProjectUtils'
import PageTitle from '@/components/PageTitle'
import { TaskTable } from '@/components/TaskTable'
import { taskColumnsDeleted } from '@/components/TaskColumnsDeleted'
import { TaskHeaderButton } from '@/components/TaskHeaderButton'

export default function RecentlyDeleted() {
    const { projects, trashedProjects, restoreProject, deleteProject } = useContext(ProjectContext)
    const [trashedTasks, setTrashedTasks] = useState({})

    useEffect(() => {
        if (projects == null || projects.length === 0)
            return
        fetchTasks(setTrashedTasks, true)
    }, [projects])

    return (
        <>
            <PageTitle title={'Recently Deleted | Checkmate'}/>
            <TaskPageContent pageTitle={'Recently Deleted'}>
                <TaskTable
                    columns={taskColumnsDeleted}
                    data={formatTasks(trashedTasks, projects)}
                    restoreItem={taskId => restoreTask(setTrashedTasks, taskId)}
                    deleteItem={taskId => deleteTask(setTrashedTasks, taskId)}
                />
                <h3 className='text-4xl font-bold ml-20 mb-8 mt-24'>Projects</h3>
                <TaskTable
                    columns={projectColumns}
                    data={formatProjects(trashedProjects)}
                    restoreItem={restoreProject}
                    deleteItem={deleteProject}
                />
            </TaskPageContent>
        </>
    )
}

const projectColumns = [
    {
        accessorKey: "padding-left",
        header: ({}) => {
            return (
                <div className='w-3'></div>
            )
        },
        sortingFns: "basic",
        
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <TaskHeaderButton column={column} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Project Name</TaskHeaderButton>
            )
        },
        sortingFn: (rowA, rowB) => {
            const nameA = rowA.getValue('title').toLowerCase();
            const nameB = rowB.getValue('title').toLowerCase();
            return nameA.localeCompare(nameB);
        },
    },
    {
        accessorKey: "padding-left",
        header: ({}) => {
            return (
                <div className='w-64'></div>
            )
        },
        sortingFns: "basic",
    },
    {
        accessorKey: "padding-left",
        header: ({}) => {
            return (
                <div className='w-16'></div>
            )
        },
        sortingFns: "basic",
    },
    {
        accessorKey: "recover",
        header: ({}) => {
            return (
                <div className='sr-only'>Recover Project Buttons</div>
            )
        },
    },
    {
        accessorKey: "delete",
        header: ({}) => {
            return (
                <div className='sr-only'>Delete Project Buttons</div>
            )
        },
    },
]

const formatProjects = projects => projects.map(project => {
    return {
        id: project.id,
        title: project.name,
    }
})

