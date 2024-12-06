package rest.resource;

import dao.TaskDAO;
import dao.UserDAO;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Task;
import model.User;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/tasks")
@RolesAllowed({"user"})
public class TaskResource {

    @Inject
    private TaskDAO taskDAO;
    @Inject
    private UserDAO userDAO;

    @Inject
    private JsonWebToken jwt;

    //Read all tasks
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTasks() {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        return Response.ok(taskDAO.getAllUserTasks(user.getEmail())).build();
    }

    //Read all completed tasks
    @GET
    @Path("/completed")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCompletedTasks() {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null || !isSessionValid(user)) {
            return Response.status(Response.Status.UNAUTHORIZED).build("Session expired. Please log in again.").build();
        }
        return Response.ok(taskDAO.getAllUserTasks(user.getEmail())).build();
    }

    //Read a task by its ID
    @GET
    @Path("/{taskId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTaskById(@PathParam("taskId") int taskId) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        Task task = taskDAO.getTaskById(taskId, user.getEmail());
        if (task != null) {
            return Response.ok().entity(task).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    // Read all project tasks
    @GET
    @Path("/projects/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProjectTasks(@PathParam("projectId") int projectId) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        return Response.ok(taskDAO.getAllProjectTasks(projectId, user.getEmail())).build();
    }

    //Create a new task
    @POST
    @Consumes(MediaType.APPLICATION_JSON)  // Ensure this line exists to tell the API to expect JSON
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTask(Task task) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        task.setUserEmail(user.getEmail());
        task = taskDAO.createTask(task);
        return Response.status(Response.Status.CREATED).entity(task).build();
    }


    //Update the status of a task
    @PUT
    @Path("/{taskId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTask(@PathParam("taskId") int taskId, Task task) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        taskDAO.updateTask(taskId, task, user.getEmail());
        return Response.ok().entity(task).build();
    }

    // Trash a task by ID
    @PUT
    @Path("/trash/{taskId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response trashTask(@PathParam("taskId") int taskId, Task task) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        taskDAO.trashTask(taskId, user.getEmail());
        return Response.noContent().build();
    }

    // Restore a trashed task by ID
    @PUT
    @Path("/restore/{taskId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response restoreTask(@PathParam("taskId") int taskId, Task task) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        taskDAO.restoreTask(taskId, user.getEmail());
        return Response.noContent().build();
    }

    //Delete a trashed task by ID
    @DELETE
    @Path("/{taskId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteTrashTask(@PathParam("taskId") int taskId) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        taskDAO.deleteTrashTask(taskId, user.getEmail());
        return Response.noContent().build();
    }

    @GET
    @Path("/trash")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTrashedTasks() {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        return Response.ok(taskDAO.getTrashedUserTasks(user.getEmail())).build();
    }
}