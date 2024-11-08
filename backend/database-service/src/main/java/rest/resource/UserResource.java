package rest.resource;

import dao.UserDAO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.User;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/user")
@RequestScoped
public class UserResource {

    @Inject
    private UserDAO userDAO;

    @Inject
    private JsonWebToken jwt;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser() {
        User user = userDAO.getUserByEmail(jwt.getSubject());
        if (user == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        user.setPassword("");
        return Response.ok(user).build();
    }

}
