import jakarta.inject.Inject;
import jakarta.servlet.annotation.HttpConstraint;
import jakarta.servlet.annotation.ServletSecurity;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import util.JwtUtil;

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

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getRemoteUser();
        var roles = JwtUtil.getRoles(request);
        var jwt = JwtUtil.buildJwt(username, roles);
        response.sendRedirect(frontendRoot + "?jwt=" + jwt);
    }
}
