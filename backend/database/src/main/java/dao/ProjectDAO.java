package dao;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import model.Project;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Startup
@ApplicationScoped
public class ProjectDAO {

    @Inject
    @ConfigProperty(name = "oz.database.path")
    private String dbPath;
    private String sqlPath;

    // Create the Projects table if it doesn't exist
    @PostConstruct
    private void createProjectTableIfNotExists() {
        sqlPath = "jdbc:sqlite:" + dbPath;

        System.out.println("Attempting to construct 'Projects' table");
        String createTableSQL = """
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                user_email TEXT,
                trash INTEGER DEFAULT 0,
                FOREIGN KEY (user_email) REFERENCES users(email)
            );
            """;

        try (Connection conn = DriverManager.getConnection(sqlPath);
             Statement stmt = conn.createStatement()) {
            stmt.execute(createTableSQL);
            System.out.println("Table 'projects' created or already exists.");
        } catch (SQLException e) {
            System.out.println("Error creating Projects table: " + e.getMessage());
        }
    }

    // Create a new project
    public Project createProject(Project project) {
        String sql = "INSERT INTO projects (name, description, user_email) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, project.getName());
            pstmt.setString(2, project.getDescription());
            pstmt.setString(3, project.getUserEmail());
            pstmt.executeUpdate();
            System.out.println("Project created successfully in the 'Projects' table.");

            ResultSet rs = pstmt.getGeneratedKeys();
            if (rs.next())
                project.setId(rs.getInt(1));
            return project;

        } catch (SQLException e) {
            System.out.println("Error creating project: " + e.getMessage());
            return null;
        }
    }

    // Read all projects
    public List<Project> getAllUserProjects(String userEmail) {
        String sql = "SELECT id, name, user_email, description, trash FROM projects WHERE user_email = ?";
        List<Project> projects = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, userEmail);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                Project project = new Project();
                project.setId(rs.getInt("id"));
                project.setName(rs.getString("name"));
                project.setDescription(rs.getString("description"));
                project.setUserEmail(rs.getString("user_email"));
                project.setTrash(rs.getInt("trash"));
                projects.add(project);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Error retrieving projects: " + e.getMessage());
        }

        return projects;
    }

    // Retrieve project by ID
    public Project getProjectById(int projectId, String userEmail) {
        String sql = "SELECT id, name, description, user_email, trash FROM projects WHERE id = ? AND user_email = ?";
        Project project = null;

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, projectId);
            pstmt.setString(2, userEmail);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                project = new Project();
                project.setId(rs.getInt("id"));
                project.setName(rs.getString("name"));
                project.setDescription(rs.getString("description"));
                project.setUserEmail(rs.getString("user_email"));
                project.setTrash(rs.getInt("trash"));
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving project: " + e.getMessage());
        }

        return project;
    }

    // Delete a project by ID
    public void deleteProject(int projectId, String userEmail) {
        String sql = "DELETE FROM projects WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, projectId);
            pstmt.setString(2, userEmail);
            pstmt.executeUpdate();
            System.out.println("Project with ID " + projectId + " deleted successfully.");

        } catch (SQLException e) {
            System.out.println("Error deleting project: " + e.getMessage());
        }
    }

    public void updateProject(int project_id, Project updated, String userEmail) {
        String sql = "UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, updated.getName());
            pstmt.setString(2, updated.getDescription());
            pstmt.setInt(3, project_id);
            pstmt.setString(4, userEmail);
            pstmt.executeUpdate();
            System.out.println("Project with ID " + project_id + " updated successfully.");
        } catch (SQLException e) {
            System.out.println("Error updating project: " + e.getMessage());
        }
    }

    // Trash a project by ID
    public void trashProject(int projectId, String userEmail) {
        String sql = "UPDATE projects SET trash = 1 WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, projectId);
            pstmt.setString(2, userEmail);
            pstmt.executeUpdate();

            System.out.println("Project with ID " + projectId + " trashed.");
        } catch (SQLException e) {
            System.out.println("Error trashing project: " + e.getMessage());
        }
    }

    // Restore a project by ID
    public void restoreProject(int projectId, String userEmail) {
        String sql = "UPDATE projects SET trash = 0 WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, projectId);
            pstmt.setString(2, userEmail);
            pstmt.executeUpdate();

            System.out.println("Project with ID " + projectId + " restored.");
        } catch (SQLException e) {
            System.out.println("Error restoring project: " + e.getMessage());
        }
    }
}
