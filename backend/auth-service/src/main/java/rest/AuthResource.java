package rest;

import dao.UserDAO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.User;
import util.JwtUtil;

@Path("/")
public class AuthResource {

    public static final String SESSION_ID_COOKIE = "ozSessionID", SESSION_ID_HEADER = "Oz-Session-Id", JWT_COOKIE = "jwt";

    @Inject
    private UserDAO userDAO;

    @GET
    @Path("/jwt")
    @Produces(MediaType.TEXT_PLAIN)
    public Response getJwt(@HeaderParam(SESSION_ID_HEADER) String sessionId) {
        User user;
        if (sessionId == null || (user = userDAO.getUserBySessionId(sessionId)) == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        else
            return Response.ok(JwtUtil.buildJwt(user.getEmail())).build();
    }

    @POST
    @Path("/create-user")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {
        userDAO.createUser(user);
        return Response.ok().build();
    }
}
