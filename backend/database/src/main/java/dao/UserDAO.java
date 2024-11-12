package dao;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import model.User;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.sql.*;
import java.util.Optional;
import java.util.UUID;

@Startup
@ApplicationScoped
public class UserDAO {

    @Inject
    @ConfigProperty(name = "oz.database.path")
    private String dbPath;
    private String sqlPath;

    //Create the users table if no exist
    @PostConstruct
    private void createTableIfNotExists() {
        sqlPath = "jdbc:sqlite:" + dbPath;
        System.out.println("attempting to construct table");
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS users (
                    email TEXT PRIMARY KEY,
                    username TEXT,
                    session_id TEXT,
                    password TEXT
                );
                """;

        try (Connection conn = DriverManager.getConnection(sqlPath);
             Statement stmt = conn.createStatement()) {
            stmt.execute(createTableSQL);
            System.out.println("Table 'users' Created or Already Exists.");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    //CREATE new user
    public boolean createUser(User user) {
        if (getUserByEmail(user.getEmail()) != null) {
            System.out.println("Email already exists. Cannot create user.");
            return false;
        }


        String sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getEmail());
            pstmt.setString(3, user.getPassword());
            pstmt.executeUpdate();
            System.out.println("User created successfully in the 'users' table.");

            return true;
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //get a user by ID
    public User getUserByEmail(String email) {
        String sql = "SELECT username, email, password FROM users WHERE email = ?";
        User user = null;

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                user = new User();
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return user;
    }

    public String ssoLogin(String email) {
        User user = getUserByEmail(email);
        if (user == null) {
            user = new User(email);
            createUser(user);
        }
        UUID sessionId = UUID.randomUUID();
        setSessionId(email, sessionId);
        return sessionId.toString();
    }
    public Optional<String> nativeLogin(String email, String password) {
        User user = getUserByEmail(email);
        if (user == null) {
            // Probably want to indicate that user was not found
            return Optional.empty();
        } else if (user.getPassword() == null || !user.getPassword().equals(password)) {
            // Probably want to specify password is incorrect
            return Optional.empty();
        }
        UUID sessionId = UUID.randomUUID();
        setSessionId(email, sessionId);
        return Optional.of(sessionId.toString());
    }
    public void invalidateSession(String sessionId) {
        User user = getUserBySessionId(sessionId);
        if (user != null)
            setSessionId(user.getEmail(), null);
    }

    public User getUserBySessionId(String sessionId) {
        String sql = "SELECT username, email, password FROM users WHERE session_id = ?";
        User user = null;

        System.out.println("getting user by session id");

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, sessionId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                user = new User();
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
            } else {
                System.out.println("user not found");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    private void setSessionId(String email, UUID sessionId) {
        String sql = "UPDATE users SET session_id = ? WHERE email = ?";
        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            String ses = sessionId != null ? sessionId.toString() : null;
            pstmt.setString(1, ses);
            pstmt.setString(2, email);
            pstmt.executeUpdate();
            System.out.println("User '" + email + "' given sessionId: " + ses);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
