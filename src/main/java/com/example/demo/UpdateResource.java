package com.example.demo;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Path("/update")
public class UpdateResource {
    @PUT
    @Produces("text/plain")
    public String hello() {
        return "Updated";
    }

    @PUT
    @Path("database")
    @Produces("text/plain")
    public Response connect() {
        Connection conn = null;
        try {
            // Redefine based on relative path after testing server-side.
            String url = "jdbc:sqlite:/home/{LOCAL}/{PATH}/{TO}/{PROJECT}/demo/src/main/java/com/example/demo/Database";
            conn = DriverManager.getConnection(url);

            System.out.println("Connection to SQLite has been established.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        String query = "UPDATE Todo SET Tags = 'Extracurriculars' WHERE TaskName = 'Research'";
        try (PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            preparedStatement.execute();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return Response.ok().entity("Updating. Executing query: " + query).build();
    }

    @PUT
    @Path("{someNumber}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("someNumber") int someNumber) {
        try {
            URI uri = new URI("update/" + someNumber);
            return Response.created(uri).entity("Resource " + someNumber + " updated").build();
        }
        catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return Response.temporaryRedirect(null).build();
    }
}
