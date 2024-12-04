import { useParams } from "react-router-dom";
import { TaskPage } from "./TaskPage";

export default function ProjectPage() {
    let {projectID} = useParams();
    return (
        <TaskPage variant={'project'} projectId={+projectID} />
    )
}
