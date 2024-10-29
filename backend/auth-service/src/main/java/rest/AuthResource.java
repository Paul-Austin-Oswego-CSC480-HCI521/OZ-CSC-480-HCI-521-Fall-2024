package rest;

import dao.UserDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.User;
import util.JwtUtil;

@Path("/jwt")
public class AuthResource {

    public static final String SESSION_ID_COOKIE = "sessionID", SESSION_ID_HEADER = "Oz-Session-Id", JWT_COOKIE = "jwt";

    @Inject
    private UserDAO userDAO;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response getJwt(@HeaderParam(SESSION_ID_HEADER) String sessionId) {
        User user;
        if (sessionId == null || (user = userDAO.getUserBySessionId(sessionId)) == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        else
            return Response.ok(JwtUtil.buildJwt(user.getEmail())).build();
    }

    // TODO: FOR TESTING PURPOSES ONLY, WILL BE REPLACED WITH REGISTRATION
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {
        userDAO.createUser(user);
        return Response.ok().build();
    }
}
