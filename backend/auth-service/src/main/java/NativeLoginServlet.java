import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import util.JwtUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.Map;

@WebServlet(urlPatterns = "/auth/native-login")
public class NativeLoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Get login info from json
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> loginData = objectMapper.readValue(request.getInputStream(), Map.class);
        String username = loginData.get("username");
        String password = loginData.get("password");

        //Check "database" for user on file
        if (authenticate(username, password)) {
            //Build the jwt
            var roles = getUserRoles(username);
            var jwt = JwtUtil.buildJwt(username, roles);

            //Respond with jwt
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_OK);
            Map<String, String> responseData = new HashMap<>();
            responseData.put("jwt", jwt);
            objectMapper.writeValue(response.getWriter(), responseData);
        } else {
            //Handle wrong login, will want to handle this diff. in frontend
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid credentials");
        }
    }

    //Handle that CORS BS
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost");
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
