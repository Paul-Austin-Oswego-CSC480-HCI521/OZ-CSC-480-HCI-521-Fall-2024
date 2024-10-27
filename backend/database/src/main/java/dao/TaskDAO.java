package dao;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import model.Task;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Startup
@ApplicationScoped
public class TaskDAO {

    @Inject
    @ConfigProperty(name = "oz.database.path")
    private String dbPath;

    @PostConstruct
    private void createTableIfNotExists() {
        System.out.println("attempting to construct table");
        String createTableSQL = """
        CREATE TABLE task_tracker (
            user_email TEXT NOT NULL,
            project_id INTEGER,
            task_id INTEGER,
            project_name TEXT NOT NULL,
            project_desc TEXT,
            project_status INTEGER,
            task_name TEXT NOT NULL,
            task_desc TEXT,
            task_status INTEGER,
            PRIMARY KEY (project_id, task_id),
            FOREIGN KEY (user_email) REFERENCES users(email)
        );
        """;

        try (Connection conn = DriverManager.getConnection(dbPath);
             Statement stmt = conn.createStatement()) {
            stmt.execute(createTableSQL);
            System.out.println("Table 'task_tracker' Created or Already Exists.");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    //Create task
    public void createTask(Task task) {
        String sql = "INSERT INTO task_tracker (user_email, project_name, task_name, task_desc, task_status) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, task.getUserEmail());
            pstmt.setString(2, task.getProjectName());
            pstmt.setString(3, task.getName());
            pstmt.setString(4, task.getDescription());
            pstmt.setInt(5, task.getStatus());
            pstmt.executeUpdate();
            System.out.println("Task created successfully in 'task_tracker' Table.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // Get tasks by user_id and project_id
    public List<Task> getTasksByUserAndProject(String userEmail, int projectId) {
        String sql = """
            SELECT task_id, task_name, task_desc, task_status, project_name, project_desc, project_status 
            FROM task_tracker 
            WHERE user_email = ? AND project_id = ?
        """;
        List<Task> tasks = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userEmail);
            pstmt.setInt(2, projectId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                Task task = new Task();
                task.setId(rs.getInt("task_id"));
                task.setName(rs.getString("task_name"));
                task.setDescription(rs.getString("task_desc"));
                task.setStatus(rs.getInt("task_status"));
                task.setProjectName(rs.getString("project_name"));
                task.setProjectDescription(rs.getString("project_desc"));
                task.setProjectStatus(rs.getInt("project_status"));

                tasks.add(task);
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return tasks;
    }

    // Get all tasks by user_id
    public List<Task> getAllUserTasks(String userEmail) {
        String sql = """
            SELECT task_id, task_name, task_desc, task_status, project_name, project_desc, project_status 
            FROM task_tracker 
            WHERE user_email = ?
        """;
        List<Task> tasks = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userEmail);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                Task task = new Task();
                task.setId(rs.getInt("task_id"));
                task.setName(rs.getString("task_name"));
                task.setDescription(rs.getString("task_desc"));
                task.setStatus(rs.getInt("task_status"));
                task.setProjectName(rs.getString("project_name"));
                task.setProjectDescription(rs.getString("project_desc"));
                task.setProjectStatus(rs.getInt("project_status"));

                tasks.add(task);
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return tasks;
    }

    // Update task details by project_id and user_id
    public void updateTaskDetailsByUserAndProject(String userEmail, int projectId, int taskId, String taskName, String taskDescription) {
        String sql = "UPDATE task_tracker SET task_name = ?, task_desc = ? WHERE user_email = ? AND project_id = ? AND task_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
          
            pstmt.setString(1, taskName);
            pstmt.setString(2, taskDescription);
            pstmt.setString(3, userEmail);
            pstmt.setInt(4, projectId);
            pstmt.setInt(5, taskId);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " updated successfully.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // Delete task by project_id and user_id
    public void deleteTaskByUserAndProject(String userEmail, int projectId, int taskId) {
        String sql = "DELETE FROM task_tracker WHERE user_email = ? AND project_id = ? AND task_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userEmail);
            pstmt.setInt(2, projectId);
            pstmt.setInt(3, taskId);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " deleted successfully.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // Update project details
    public void updateProjectDetails(int projectId, String projectName, String projectDescription) {
        String sql = "UPDATE task_tracker SET project_name = ?, project_desc = ? WHERE project_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, projectName);
            pstmt.setString(2, projectDescription);
            pstmt.setInt(3, projectId);
            pstmt.executeUpdate();
            System.out.println("Project with ID " + projectId + " updated successfully.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // Delete all tasks under a specific project
    public void deleteProject(int projectId) {
        String sql = "DELETE FROM task_tracker WHERE project_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, projectId);
            pstmt.executeUpdate();
            System.out.println("Project with ID " + projectId + " and its tasks deleted successfully.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}
