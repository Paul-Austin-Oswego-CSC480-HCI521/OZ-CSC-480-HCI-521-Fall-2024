package rest.resource;

import dao.TaskDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Task;

import java.util.List;

@Path("/tasks")
public class TaskResource {

    @Inject
    private TaskDAO taskDAO;

    //Get all tasks in the system
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasks() {
        return taskDAO.getAllTasks();
    }

    //Create a new task
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTask(Task task) {
        taskDAO.createTask(task);
        return Response.status(Response.Status.CREATED).entity(task).build();
    }

    //Update the status of a task by task ID
    @PUT
    @Path("/{taskId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTaskStatus(@PathParam("taskId") int taskId, Task task) {
        taskDAO.updateTaskStatus(taskId, task.getStatus());
        return Response.ok().entity(task).build();
    }

    //Update task details by user ID project ID and task ID
    @PUT
    @Path("/user/{userId}/project/{projectId}/task/{taskId}/details")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTaskDetailsByUserAndProject(
        @PathParam("userId") int userId,
        @PathParam("projectId") int projectId,
        @PathParam("taskId") int taskId,
        Task task) {
        taskDAO.updateTaskDetailsByUserAndProject(userId, projectId, taskId, task.getName(), task.getDescription());
        return Response.ok().entity(task).build();
    }

    //Delete a task by user ID project ID and task ID
    @DELETE
    @Path("/user/{userId}/project/{projectId}/task/{taskId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteTaskByUserAndProject(
        @PathParam("userId") int userId,
        @PathParam("projectId") int projectId,
        @PathParam("taskId") int taskId) {
        taskDAO.deleteTaskByUserAndProject(userId, projectId, taskId);
        return Response.noContent().build();
    }

    //Get tasks associated with a specific user and project
    @GET
    @Path("/user/{userId}/project/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasksByUserAndProject(@PathParam("userId") int userId, @PathParam("projectId") int projectId) {
        return taskDAO.getTasksByUserAndProject(userId, projectId);
    }

    //Update project details by project ID
    @PUT
    @Path("/project/{projectId}/details")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProjectDetails(@PathParam("projectId") int projectId, Task task) {
        taskDAO.updateProjectDetails(projectId, task.getProjectName(), task.getProjectDescription());
        return Response.ok().entity(task).build();
    }

    //Delete a project and all associated tasks by project ID
    @DELETE
    @Path("/project/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteProject(@PathParam("projectId") int projectId) {
        taskDAO.deleteProject(projectId);
        return Response.noContent().build();
    }
}
