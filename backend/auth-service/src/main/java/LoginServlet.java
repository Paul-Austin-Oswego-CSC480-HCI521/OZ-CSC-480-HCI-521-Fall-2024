import jakarta.inject.Inject;
import jakarta.servlet.annotation.HttpConstraint;
import jakarta.servlet.annotation.ServletSecurity;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.QuoteUnquoteDatabase;
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
    private QuoteUnquoteDatabase db;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getRemoteUser();
        long sessionId = db.login(username).get();
        Cookie sessionCookie = new Cookie(AuthResource.SESSION_ID_COOKIE, String.valueOf(sessionId));
        sessionCookie.setPath("/");
        sessionCookie.setSecure(true);
        sessionCookie.setHttpOnly(true);
        response.addCookie(sessionCookie);
        response.sendRedirect(frontendRoot);
    }
}
