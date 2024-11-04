import dao.UserDAO;
import jakarta.inject.Inject;
import jakarta.servlet.annotation.HttpConstraint;
import jakarta.servlet.annotation.ServletSecurity;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import rest.AuthResource;

import java.io.IOException;
import java.io.Serial;

@WebServlet(urlPatterns = "/auth/login")
@ServletSecurity(value = @HttpConstraint(rolesAllowed = { "user" },
        transportGuarantee = ServletSecurity.TransportGuarantee.CONFIDENTIAL))
public class LoginServlet extends HttpServlet {
    @Serial
    private static final long serialVersionUID = 1;

    @Inject
    @ConfigProperty(name = "frontend.root")
    private String frontendRoot;

    @Inject
    private UserDAO userDAO;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String domain = frontendRoot.split(":\\/\\/")[1].split(":")[0];
        System.out.println(domain);

        String email = request.getRemoteUser();
        String sessionId = userDAO.ssoLogin(email);
        Cookie sessionCookie = new Cookie(AuthResource.SESSION_ID_COOKIE, sessionId);
        sessionCookie.setPath("/");
        sessionCookie.setDomain(domain);
        // sessionCookie.setSecure(true);
        sessionCookie.setHttpOnly(true);
        // sessionCookie.setAttribute("SameSite", "None");
        response.addCookie(sessionCookie);
        response.sendRedirect(frontendRoot);
    }
}
