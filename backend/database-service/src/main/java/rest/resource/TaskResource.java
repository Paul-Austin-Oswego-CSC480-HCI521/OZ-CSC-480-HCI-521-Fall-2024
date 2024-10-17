package rest.resource;

import DAO.TaskDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import rest.model.Task;

import java.util.List;

@Path("/tasks")
public class TaskResource {

    @Inject
    private TaskDAO taskDAO;

    //Read all tasks
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasks() {
        return taskDAO.getAllTasks();
    }

    //Create a new task
    @POST
    @Consumes(MediaType.APPLICATION_JSON)  // Ensure this line exists to tell the API to expect JSON
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTask(Task task) {
        taskDAO.createTask(task);
        return Response.status(Response.Status.CREATED).entity(task).build();
    }


    //Update the status of a task
    @PUT
    @Path("/{taskId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTaskStatus(@PathParam("taskId") int taskId, Task task) {
        taskDAO.updateTaskStatus(taskId, task.getStatus());
        return Response.ok().entity(task).build();
    }

    //Delete a task
    @DELETE
    @Path("/{taskId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteTask(@PathParam("taskId") int taskId) {
        taskDAO.deleteTask(taskId);
        return Response.noContent().build();
    }
    //Read a task by its ID
    @GET
    @Path("/{taskId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTaskById(@PathParam("taskId") int taskId) {
        Task task = taskDAO.getTaskById(taskId);
        if (task != null) {
            return Response.ok().entity(task).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build(); 
        }
    }


}
