package rest.resource;

import dao.ProjectDAO;
import dao.UserDAO;
import dao.TaskDAO;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Project;
import model.User;
import org.eclipse.microprofile.jwt.JsonWebToken;

@RequestScoped
@RolesAllowed({"user"})
@Path("/projects")
public class ProjectResource {

    @Inject
    private ProjectDAO projectDAO;
    @Inject
    private UserDAO userDAO;
    @Inject
    private TaskDAO taskDAO;

    @Inject
    private JsonWebToken jwt;

    // Read all projects
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjects() {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        return Response.ok(projectDAO.getAllUserProjects(user.getEmail())).build();
    }

    // Create a new project
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createProject(Project project) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        project.setUserEmail(user.getEmail());
        project = projectDAO.createProject(project);
        return Response.status(Response.Status.CREATED).entity(project).build();
    }

    @PUT
    @Path("/{project_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProject(Project updated, @PathParam("project_id") int projectId) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        projectDAO.updateProject(projectId, updated, user.getEmail());
        updated.setId(projectId);
        return Response.ok(updated).build();
    }

    // Delete a project
    @DELETE
    @Path("/{project_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteProject(@PathParam("project_id") int project_id) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        projectDAO.deleteProject(project_id, user.getEmail());
        return Response.noContent().build();
    }

    // Read a project by its ID
    @GET
    @Path("/{project_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectById(@PathParam("project_id") int project_id) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        Project project = projectDAO.getProjectById(project_id, user.getEmail());
        if (project != null) {
            return Response.ok().entity(project).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @PUT
    @Path("/trash/{projectId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response trashProject(@PathParam("projectId") int projectId) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        projectDAO.trashProject(projectId, user.getEmail());
        taskDAO.projectTrash(projectId, user.getEmail());
        return Response.noContent().build();
    }

    @PUT
    @Path("/restore/{projectId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response restoreProject(@PathParam("projectId") int projectId) {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        projectDAO.restoreProject(projectId, user.getEmail());
        taskDAO.projectRestore(projectId, user.getEmail());
        return Response.noContent().build();
    }
}
