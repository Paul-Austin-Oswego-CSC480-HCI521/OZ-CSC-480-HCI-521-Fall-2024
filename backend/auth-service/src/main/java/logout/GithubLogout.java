package logout;

import com.ibm.websphere.security.social.UserProfileManager;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RequestScoped
public class GithubLogout implements ILogout {

    @Inject
    @ConfigProperty(name = "github.client.id")
    private String clientId;

    @Inject
    @ConfigProperty(name = "github.client.secret")
    private String clientSecret;

    final String unauthorizeURL = "https://api.github.com/applications/{client_id}/grant";

    @Override
    public Response logout() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("access_token", UserProfileManager.getUserProfile().getAccessToken());
        String auth = clientId + ":" + clientSecret;
        String encodedAuth = new String(Base64.getEncoder().encode(auth.getBytes(StandardCharsets.ISO_8859_1)));
        try (var client = ClientBuilder.newClient()) {
            return client.target(unauthorizeURL)
                    .resolveTemplate("client_id", clientId)
                    .request()
                    .header("Authorization", "Basic " + encodedAuth)
                    .method("DELETE", Entity.json(requestBody));
        }
    }
}
