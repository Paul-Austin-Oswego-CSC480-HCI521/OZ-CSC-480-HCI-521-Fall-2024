package dao;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import model.User;

import java.sql.*;
import java.util.Optional;
import java.util.UUID;

@Startup
@ApplicationScoped
public class UserDAO {

    @Inject
    @ConfigProperty(name = "oz.database.path")
    private String dbPath;

    //Create the users table if no exist
    @PostConstruct
    private void createTableIfNotExists() {
        System.out.println("attempting to construct table");
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS users (
                    email TEXT PRIMARY KEY,
                    username TEXT,
                    session_id TEXT,
                    password TEXT
                );
                """;

        try (Connection conn = DriverManager.getConnection(dbPath);
             Statement stmt = conn.createStatement()) {
            stmt.execute(createTableSQL);
            System.out.println("Table 'users' Created or Already Exists.");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    //CREATE new user
    public void createUser(User user) {
        String sql = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getEmail());
            pstmt.setString(2, user.getUsername());
            pstmt.setString(3, user.getPassword());
            pstmt.executeUpdate();
            System.out.println("User created successfully in the 'users' table.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
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

    //READ all users
//    public List<User> getAllUsers() {
//        String sql = "SELECT user_id, username, email, password FROM users";
//        List<User> users = new ArrayList<>();
//
//        try (Connection conn = DriverManager.getConnection(dbPath);
//             Statement stmt = conn.createStatement();
//             ResultSet rs = stmt.executeQuery(sql)) {
//
//            while (rs.next()) {
//                User user = new User();
//                user.setUserEmail(rs.getInt("user_id"));
//                user.setUsername(rs.getString("username"));
//                user.setEmail(rs.getString("email"));
//                user.setPassword(rs.getString("password"));
//                users.add(user);
//            }
//
//        } catch (SQLException e) {
//            System.out.println(e.getMessage());
//        }
//
//        return users;
//    }

    //get a user by ID
    public User getUserByEmail(String email) {
        String sql = "SELECT username, email, password FROM users WHERE email = ?";
        User user = null;

        try (Connection conn = DriverManager.getConnection(dbPath);
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

    public User getUserBySessionId(String sessionId) {
        String sql = "SELECT username, email, password FROM users WHERE session_id = ?";
        User user = null;

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, sessionId);
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

    private void setSessionId(String email, UUID sessionId) {
        String sql = "UPDATE users SET session_id = ? WHERE email = ?";
        try (Connection conn = DriverManager.getConnection(dbPath);
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

    //DELETE a user by ID
//    public void deleteUser(int userId) {
//        String sql = "DELETE FROM users WHERE user_id = ?";
//
//        try (Connection conn = DriverManager.getConnection(dbPath);
//             PreparedStatement pstmt = conn.prepareStatement(sql)) {
//
//            pstmt.setInt(1, userId);
//            pstmt.executeUpdate();
//            System.out.println("User with ID " + userId + " deleted successfully.");
//
//        } catch (SQLException e) {
//            System.out.println(e.getMessage());
//        }
//    }
}
