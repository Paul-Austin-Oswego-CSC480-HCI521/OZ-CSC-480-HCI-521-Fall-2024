package rest.resource;

import DAO.ProjectDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import rest.model.Project;

import java.util.List;

@Path("/projects")
public class ProjectResource {

    @Inject
    private ProjectDAO projectDAO;

    // Read all projects
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Project> getProjects() {
        return projectDAO.getAllProjects();
    }

    // Create a new project
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createProject(Project project) {
        projectDAO.createProject(project);
        return Response.status(Response.Status.CREATED).entity(project).build();
    }

    // Delete a project
    @DELETE
    @Path("/{project_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteProject(@PathParam("project_id") int project_id) {
        projectDAO.deleteProject(project_id);
        return Response.noContent().build();
    }

    // Read a project by its ID
    @GET
    @Path("/{project_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectById(@PathParam("project_id") int project_id) {
        Project project = projectDAO.getProjectById(project_id);
        if (project != null) {
            return Response.ok().entity(project).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
