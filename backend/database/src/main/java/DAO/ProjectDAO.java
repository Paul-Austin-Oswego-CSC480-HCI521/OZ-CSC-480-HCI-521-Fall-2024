package DAO;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import rest.model.Project;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Startup
@ApplicationScoped
public class ProjectDAO {

    @Inject
    @ConfigProperty(name = "database.path")
    private String dbPath;

    // Create the Projects table if it doesn't exist
    @PostConstruct
    private void createProjectTableIfNotExists() {
        System.out.println("Attempting to construct 'Projects' table");
        String createTableSQL = """
            CREATE TABLE IF NOT EXISTS Projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                description TEXT
            );
            """;

        try (Connection conn = DriverManager.getConnection(dbPath);
             Statement stmt = conn.createStatement()) {
            stmt.execute(createTableSQL);
            System.out.println("Table 'Projects' created or already exists.");
        } catch (SQLException e) {
            System.out.println("Error creating Projects table: " + e.getMessage());
        }
    }

    // Create a new project
    public void createProject(Project project) {
        String sql = "INSERT INTO Projects (name, description) VALUES (?, ?)";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, project.getName());
            pstmt.setString(2, project.getDescription());
            pstmt.executeUpdate();
            System.out.println("Project created successfully in the 'Projects' table.");

        } catch (SQLException e) {
            System.out.println("Error creating project: " + e.getMessage());
        }
    }

    // Read all projects
    public List<Project> getAllProjects() {
        String sql = "SELECT id, name, description FROM Projects";
        List<Project> projects = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(dbPath);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Project project = new Project();
                project.setId(rs.getInt("id"));
                project.setName(rs.getString("name"));
                project.setDescription(rs.getString("description"));
                projects.add(project);
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving projects: " + e.getMessage());
        }

        return projects;
    }

    // Retrieve project by ID
    public Project getProjectById(int projectId) {
        String sql = "SELECT id, name, description FROM Projects WHERE id = ?";
        Project project = null;

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, projectId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                project = new Project();
                project.setId(rs.getInt("id"));
                project.setName(rs.getString("name"));
                project.setDescription(rs.getString("description"));
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving project: " + e.getMessage());
        }

        return project;
    }

    // Delete a project by ID
    public void deleteProject(int projectId) {
        String sql = "DELETE FROM Projects WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, projectId);
            pstmt.executeUpdate();
            System.out.println("Project with ID " + projectId + " deleted successfully.");

        } catch (SQLException e) {
            System.out.println("Error deleting project: " + e.getMessage());
        }
    }
}
