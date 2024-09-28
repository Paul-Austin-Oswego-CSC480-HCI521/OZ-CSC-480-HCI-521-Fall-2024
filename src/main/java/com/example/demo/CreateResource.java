package com.example.demo;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.net.URISyntaxException;

@Path("/create")
public class CreateResource {
    @POST
    @Produces("text/plain")
    public String hello() {
        return "Created";
    }

    @POST
    @Path("{someNumber}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("someNumber") int someNumber) {
        try {
            URI uri = new URI("create/new-resource");
            return Response.created(uri).entity("Resource " + someNumber + " created").build();
        }
        catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return Response.serverError().build();
    }
}
