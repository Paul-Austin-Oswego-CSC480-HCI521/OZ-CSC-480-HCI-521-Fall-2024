import dao.UserDAO;
import jakarta.inject.Inject;
import jakarta.servlet.annotation.HttpConstraint;
import jakarta.servlet.annotation.ServletSecurity;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import rest.AuthResource;

import java.io.IOException;
import java.util.Optional;
import java.util.Map;

@WebServlet(urlPatterns = "/auth/native-login")
@ServletSecurity(value = @HttpConstraint(transportGuarantee = ServletSecurity.TransportGuarantee.CONFIDENTIAL))
public class NativeLoginServlet extends HttpServlet {

    @Inject
    private UserDAO userDAO;

    @Inject
    @ConfigProperty(name = "frontend.root")
    private String frontendRoot;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Get login info from json (believe this should be sent as a JWT? Not sure about security measures here...)
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> loginData = objectMapper.readValue(request.getInputStream(), Map.class);

        Optional<String> sessionId = userDAO.nativeLogin(loginData.get("username"), loginData.get("password"));

        if (sessionId.isPresent()) {
            Cookie sessionCookie = new Cookie(AuthResource.SESSION_ID_COOKIE, sessionId.get());
            sessionCookie.setPath("/");
            sessionCookie.setSecure(true);
            sessionCookie.setHttpOnly(true);
            sessionCookie.setAttribute("SameSite", "None");
            response.addCookie(sessionCookie);
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
}
