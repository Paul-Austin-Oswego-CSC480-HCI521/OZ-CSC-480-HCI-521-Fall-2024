package logout;

import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.core.Response;

@RequestScoped
public class NativeLogout implements ILogout {
    @Override
    public Response logout() {
        return Response.noContent().build();
    }
}
