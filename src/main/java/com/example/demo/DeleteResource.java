package com.example.demo;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/delete")
public class DeleteResource {
    @DELETE
    public String hello() {
        return "Deleted";
    }

    @DELETE
    @Path("{someNumber}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("someNumber") int someNumber) {
        return Response.status(200).entity("Deleted resource " + someNumber).build();
    }
}
