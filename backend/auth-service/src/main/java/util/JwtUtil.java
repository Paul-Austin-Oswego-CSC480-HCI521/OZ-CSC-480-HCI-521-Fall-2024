package util;

import com.ibm.websphere.security.jwt.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashSet;
import java.util.Set;

public class JwtUtil {

    public static String buildJwt(String username, Set<String> roles) {
        try {
            return JwtBuilder.create("jwtFrontEndBuilder")
                    .claim(Claims.SUBJECT, username)
                    .claim("upn", username)
                    .claim("groups", roles.toArray(new String[0]))
                    .claim("aud", "frontend")
                    .buildJwt()
                    .compact();
        } catch (JwtException | InvalidClaimException | InvalidBuilderException e) {
            throw new RuntimeException(e);
        }
    }

    public static Set<String> getRoles(HttpServletRequest request) {
        Set<String> roles = new HashSet<>();
        if (request.isUserInRole("user"))
            roles.add("user");
        return roles;
    }
}
