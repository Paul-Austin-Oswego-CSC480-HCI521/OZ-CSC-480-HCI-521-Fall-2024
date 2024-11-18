package util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public class CookieUtil {

    public static Cookie getCookie(HttpServletRequest request, String name) {
        for (var cookie : request.getCookies())
            if (cookie.getName().equals(name))
                return cookie;
        return null;
    }

    public static String getDomainFromPath(String path) {
        return path.split(":\\/\\/")[1].split(":")[0];
    }
}
