package util;

import com.ibm.websphere.security.jwt.*;

public class JwtUtil {

    public static String buildJwt(String username) {
        try {
            return JwtBuilder.create("jwtFrontEndBuilder")
                    .claim(Claims.SUBJECT, username)
                    .claim("upn", username)
                    .claim("groups", new String[]{"user"})
                    .claim("aud", "frontend")
                    .buildJwt()
                    .compact();
        } catch (JwtException | InvalidClaimException | InvalidBuilderException e) {
            throw new RuntimeException(e);
        }
    }
}
