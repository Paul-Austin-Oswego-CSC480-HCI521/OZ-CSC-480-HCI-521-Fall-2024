package rest;

import dao.UserDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.QuoteUnquoteDatabase;
import model.User;
import util.JwtUtil;

import java.util.Optional;
import java.util.Set;

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
            return Response.ok(JwtUtil.buildJwt(user.getEmail(), Set.of("user"))).build();
    }
}
