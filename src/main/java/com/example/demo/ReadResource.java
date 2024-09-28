package com.example.demo;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.*;

@Path("/read")
public class ReadResource {
    @GET
    @Produces("text/plain")
    public String hello() {
        return "Read";
    }

    @GET
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

        String query = "SELECT * FROM Todo";
        try (Statement statement = conn.createStatement()) {
            ResultSet resultSet = statement.executeQuery(query);
            System.out.println("Executing query: " + query);
            while (resultSet.next()) {
                // Check for specific column name
                String taskName = resultSet.getString("TaskName");
                System.out.println(taskName);

                // Testing alternative
                System.out.println(resultSet.getString(2));
                System.out.println(resultSet.getString(3));
                System.out.println(resultSet.getString(4));
                System.out.println(resultSet.getString(5));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {
            conn.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }

        return Response.ok("Database connection established").build();
    }

    @GET
    @Path("{someNumber}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response get(@PathParam("someNumber") int someNumber) {
        return Response.ok().entity(someNumber).build();
    }
}
