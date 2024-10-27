package rest.resource;

import dao.TaskDAO;
import dao.UserDAO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Task;
import model.User;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.ArrayList;
import java.util.List;

@RequestScoped
@Path("/tasks")
public class TaskResource {

    @Inject
    private TaskDAO taskDAO;
    @Inject
    private UserDAO userDAO;

    @Inject
    private JsonWebToken jwt;

    //Get all tasks in the system
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasks() {
        System.out.println("user: " + jwt.getSubject());
        User user = userDAO.getUserByEmail(jwt.getSubject());
        // TODO: should be some form of error
        if (user == null) {
            System.out.println("user is null");
            return new ArrayList<>();
        }
        return taskDAO.getAllUserTasks(user.getEmail());
    }

    //Create a new task
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTask(Task task) {
        task.setUserEmail(jwt.getSubject());
        taskDAO.createTask(task);
        return Response.status(Response.Status.CREATED).entity(task).build();
    }

    //Update the status of a task by task ID
//    @PUT
//    @Path("/{taskId}")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response updateTaskStatus(@PathParam("taskId") int taskId, Task task) {
//        taskDAO.updateTaskStatus(taskId, task.getStatus());
//        return Response.ok().entity(task).build();
//    }

    //Update task details by user ID project ID and task ID
    @PUT
    @Path("/project/{projectId}/task/{taskId}/details")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTaskDetailsByUserAndProject(
        @PathParam("projectId") int projectId,
        @PathParam("taskId") int taskId,
        Task task) {
        taskDAO.updateTaskDetailsByUserAndProject(jwt.getSubject(), projectId, taskId, task.getName(), task.getDescription());
        return Response.ok().entity(task).build();
    }

    //Delete a task by user ID project ID and task ID
    @DELETE
    @Path("/project/{projectId}/task/{taskId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteTaskByUserAndProject(
        @PathParam("projectId") int projectId,
        @PathParam("taskId") int taskId) {
        taskDAO.deleteTaskByUserAndProject(jwt.getSubject(), projectId, taskId);
        return Response.noContent().build();
    }

    //Get tasks associated with a specific user and project
    @GET
    @Path("/project/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasksByUserAndProject(@PathParam("projectId") int projectId) {
        return taskDAO.getTasksByUserAndProject(jwt.getSubject(), projectId);
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
