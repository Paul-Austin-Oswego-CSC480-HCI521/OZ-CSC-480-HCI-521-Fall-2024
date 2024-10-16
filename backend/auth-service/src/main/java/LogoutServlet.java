import jakarta.inject.Inject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.HttpConstraint;
import jakarta.servlet.annotation.ServletSecurity;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.core.Response;
import logout.LogoutHandler;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.io.Serial;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "LogoutServlet", urlPatterns = "/auth/logout")
@ServletSecurity(value = @HttpConstraint(rolesAllowed = {"user"},
        transportGuarantee = ServletSecurity.TransportGuarantee.CONFIDENTIAL))
public class LogoutServlet extends HttpServlet {
    @Serial
    private static final long serialVersionUID = 1L;

    @Inject
    @ConfigProperty(name = "frontend.root")
    private String frontendRoot;

    @Inject
    private LogoutHandler logoutHandler;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        try (Response logoutResponse = logoutHandler.getLogout().logout()) {
            if (!logoutResponse.getStatusInfo().getFamily().equals(Response.Status.Family.SUCCESSFUL)) {
                Logger.getLogger("LogoutServlet")
                        .log(Level.SEVERE, logoutResponse.readEntity(Map.class).toString());
                throw new ServletException("Could not delete OAuth2 application grant");
            }
        }
        request.logout();
        response.sendRedirect(frontendRoot);
    }
}
