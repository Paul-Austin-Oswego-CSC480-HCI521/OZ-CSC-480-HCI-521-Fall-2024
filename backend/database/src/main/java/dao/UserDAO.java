package dao;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import model.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Startup
@ApplicationScoped
public class UserDAO {

    @Inject
    @ConfigProperty(name = "database.path.users")
    private String dbPath;

    //Create the users table if no exist
    @PostConstruct
    private void createTableIfNotExists() {
        System.out.println("attempting to construct table");
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS users (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    email TEXT NOT NULL,
                    password TEXT NOT NULL
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
        String sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getEmail());
            pstmt.setString(3, user.getPassword());
            pstmt.executeUpdate();
            System.out.println("User created successfully in the 'users' table.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    //READ all users
    public List<User> getAllUsers() {
        String sql = "SELECT user_id, username, email, password FROM users";
        List<User> users = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(dbPath);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                User user = new User();
                user.setUserId(rs.getInt("user_id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
                users.add(user);
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return users;
    }

    //get a user by ID
    public User getUserById(int userId) {
        String sql = "SELECT user_id, username, email, password FROM users WHERE user_id = ?";
        User user = null;

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                user = new User();
                user.setUserId(rs.getInt("user_id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return user;
    }

    //UPDATE a USER email
    public void updateUserEmail(int userId, String email) {
        String sql = "UPDATE users SET email = ? WHERE user_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            pstmt.setInt(2, userId);
            pstmt.executeUpdate();
            System.out.println("User with ID " + userId + " updated successfully.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    //DELETE a user by ID
    public void deleteUser(int userId) {
        String sql = "DELETE FROM users WHERE user_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            pstmt.executeUpdate();
            System.out.println("User with ID " + userId + " deleted successfully.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}
