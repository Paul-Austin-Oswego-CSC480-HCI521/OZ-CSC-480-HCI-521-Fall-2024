package rest;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.QuoteUnquoteDatabase;

import java.util.Optional;

@Path("/jwt")
public class AuthResource {

    public static final String SESSION_ID_COOKIE = "sessionID", SESSION_ID_HEADER = "Oz-Session-Id", JWT_COOKIE = "jwt";

    @Inject
    private QuoteUnquoteDatabase db;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response getJwt(@HeaderParam(SESSION_ID_HEADER) Long sessionId) {
        Optional<String> jwtOpt;
        if (sessionId == null || (jwtOpt = db.jwt(sessionId)).isEmpty())
            return Response.status(Response.Status.UNAUTHORIZED).build();
        else
            return Response.ok(jwtOpt.get()).build();
    }
}
