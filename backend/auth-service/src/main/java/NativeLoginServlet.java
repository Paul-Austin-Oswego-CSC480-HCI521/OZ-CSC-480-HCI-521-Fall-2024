import jakarta.inject.Inject;
import jakarta.servlet.annotation.HttpConstraint;
import jakarta.servlet.annotation.ServletSecurity;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import model.QuoteUnquoteDatabase;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import rest.AuthResource;

import java.io.IOException;
import java.util.Set;
import java.util.Map;

@WebServlet(urlPatterns = "/auth/native-login")
@ServletSecurity(value = @HttpConstraint(transportGuarantee = ServletSecurity.TransportGuarantee.CONFIDENTIAL))
public class NativeLoginServlet extends HttpServlet {

    @Inject
    private QuoteUnquoteDatabase db;

    @Inject
    @ConfigProperty(name = "frontend.root")
    private String frontendRoot;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Get login info from json (believe this should be sent as a JWT? Not sure about security measures here...)
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> loginData = objectMapper.readValue(request.getInputStream(), Map.class);

        String username = loginData.get("username");
        String password = loginData.get("password");

        //Check "database" for user on file
        if (authenticate(username, password)) {
            // replace authenticate call with a login(username, password)
            long sessionId = db.login(username).get();
            Cookie sessionCookie = new Cookie(AuthResource.SESSION_ID_COOKIE, String.valueOf(sessionId));
            sessionCookie.setPath(frontendRoot);
            sessionCookie.setSecure(true);
            sessionCookie.setHttpOnly(true);
            response.addCookie(sessionCookie);
            System.out.println(frontendRoot);
        } else {
            //Handle wrong login, will want to handle this diff. in frontend
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid credentials");
        }
    }

    //Handle that CORS BS
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", frontendRoot);
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private boolean authenticate(String username, String password) {
        //TODO: make not a placeholder database
        return "user@gmail.com".equals(username) && "password".equals(password);
    }

    private Set<String> getUserRoles(String username) {
        //TODO: make not a placeholder database
        return Set.of("user");
    }
}
