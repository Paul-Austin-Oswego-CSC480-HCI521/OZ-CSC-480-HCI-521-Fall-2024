package com.demo;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/users")
public class UserResource {

    private UserDAO userDAO = new UserDAO();

    //READ users
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getUsers() {
        return userDAO.getAllUsers();
    }

    //CREATE user
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {
        userDAO.createUser(user);
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

    //UPDATE  a users email
    @PUT
    @Path("/{userId}/email")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserEmail(@PathParam("userId") int userId, User user) {
        userDAO.updateUserEmail(userId, user.getEmail());
        return Response.ok().entity(user).build();
    }

    //DELETE a user
    @DELETE
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("userId") int userId) {
        userDAO.deleteUser(userId);
        return Response.noContent().build();
    }

    //read specific user by email
    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserById(@PathParam("userId") int userId) {
        User user = userDAO.getUserById(userId);
        if (user != null) {
            return Response.ok().entity(user).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
