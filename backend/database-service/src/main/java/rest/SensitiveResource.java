package rest;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Path("/tasks")
public class SensitiveResource {

    @GET
    @RolesAllowed({ "user" })
    @Produces(MediaType.APPLICATION_JSON)
    public String getTasks(@HeaderParam("Authorization") String authHeader) {
        String subject = decryptJwtSubject(getJwtFromAuthHeader(authHeader));
        if ("jjhh12@outlook.com".equals(subject))
            return "{\"tasks\":[\"do something upstanding\"],\"user\":\"" + subject + "\"}";
        else if ("jhubbar4@oswego.edu".equals(subject))
            return "{\"tasks\":[\"do some smurfing\"],\"user\":\"" + subject + "\"}";
        else if ("user@gmail.com".equals(subject))
            return "{\"tasks\":[\"cry\"],\"user\":\"" + subject + "\"}";
        return "{\"tasks\":[],\"user\":\"" + subject + "\"}";
    }

    private String getJwtFromAuthHeader(String authHeader) {
        return authHeader.split("Bearer ", 2)[1];
    }

    private String decryptJwtSubject(String jwt) {
        String[] components = jwt.split("\\.", 3);
        if (components.length < 3)
            return null;
        String body = new String(Base64.getDecoder().decode(components[1].getBytes()));
        Matcher subRX = Pattern.compile("\\\"sub\\\":\\s*\\\"([^,]*)\\\"").matcher(body);
        if (subRX.find())
            return subRX.group(1);
        return null;
    }

}
