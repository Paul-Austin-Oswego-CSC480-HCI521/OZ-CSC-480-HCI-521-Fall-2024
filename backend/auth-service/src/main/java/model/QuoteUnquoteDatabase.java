package model;

import jakarta.ejb.Singleton;
import jakarta.enterprise.context.ApplicationScoped;
import util.JwtUtil;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@ApplicationScoped
@Singleton
public class QuoteUnquoteDatabase {

    public static class User {
        String subject;
        User(String s) { subject = s; }
    }

    static class SessionData {
        Instant expiration;
        User user;
        SessionData(User u) {
            user = u;
            resetExpiration();
        }
        void resetExpiration() {
            // technically a data race, almost certainly doesn't matter
            expiration = Instant.now().plus(Duration.ofMinutes(15));
        }
    }

    private final ConcurrentHashMap<Long, SessionData> sessionDB = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, User> userDB = new ConcurrentHashMap<>();

    public Optional<Long> login(String subject) {
        if (!userDB.containsKey(subject))
            // for native login, this would return Optional.empty(), and there would have to be createUser
            userDB.put(subject, new User(subject));
        Long sessionID = ThreadLocalRandom.current().nextLong();
        sessionDB.put(sessionID, new SessionData(userDB.get(subject)));
        return Optional.of(sessionID);
    }

    public Optional<String> jwt(Long sessionId) {
        SessionData sessionData = sessionDB.get(sessionId);
        if (sessionData == null || !sessionData.expiration.isAfter(Instant.now())) {
            sessionDB.remove(sessionId);
            return Optional.empty();
        }
        sessionData.resetExpiration();
        return Optional.of(JwtUtil.buildJwt(sessionData.user.subject, Set.of("user")));
    }

    public void invalidateSession(Long sessionId) {
        sessionDB.remove(sessionId);
    }

}
