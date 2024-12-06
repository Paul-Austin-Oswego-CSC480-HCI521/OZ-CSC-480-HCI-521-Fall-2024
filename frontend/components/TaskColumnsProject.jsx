// Columns for the Task Table
// Documentation: https://ui.shadcn.com/docs/components/data-table

import { TaskHeaderButton } from '@/components/TaskHeaderButton'
import { taskColumns } from './TaskColumns'

// Columns for TaskTable, accessorKey needs to match ket used in initialTasks/task data
export const taskColumnsProject = taskColumns.filter(({accessorKey}) => accessorKey !== 'project')