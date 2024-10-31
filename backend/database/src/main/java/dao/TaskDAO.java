package DAO;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import rest.model.Task;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Startup
@ApplicationScoped
public class TaskDAO {

    @Inject
    @ConfigProperty(name = "database.path")
    private String dbPath;

    // Create the task_tracker table if it doesn't exist
    @PostConstruct
    private void createTableIfNotExists() {
        System.out.println("Attempting to construct 'task_tracker' table");
        String createTableSQL = """
            CREATE TABLE IF NOT EXISTS task_tracker (
                task_id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_name TEXT NOT NULL,
                task_desc TEXT,
                status INTEGER DEFAULT 0,
                project_name TEXT,
                FOREIGN KEY (project_name) REFERENCES Projects(project_name)
            );
            """;

        try (Connection conn = DriverManager.getConnection(dbPath);
             Statement stmt = conn.createStatement()) {
            stmt.execute(createTableSQL);
            System.out.println("Table 'task_tracker' created or already exists.");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // Create a new task
    public void createTask(Task task) {
        String insertTaskSql = "INSERT INTO task_tracker (task_name, task_desc, status, project_name) VALUES (?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmtInsert = conn.prepareStatement(insertTaskSql)) {

            // Insert the new task
            pstmtInsert.setString(1, task.getName());
            pstmtInsert.setString(2, task.getDescription());
            pstmtInsert.setInt(3, task.getStatus());  // 0 for incomplete | 1 for complete
            pstmtInsert.setString(4, task.getProjectName());
            pstmtInsert.executeUpdate();

            System.out.println("Task created successfully.");

        } catch (SQLException e) {
            System.out.println("Error creating task: " + e.getMessage());
        }
    }

    // Read all tasks
    public List<Task> getAllTasks() {
        String sql = "SELECT task_id, task_name, task_desc, status, project_name FROM task_tracker";
        List<Task> tasks = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(dbPath);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Task task = new Task();
                task.setId(rs.getInt("task_id"));
                task.setName(rs.getString("task_name"));
                task.setDescription(rs.getString("task_desc"));
                task.setStatus(rs.getInt("status"));
                task.setProjectName(rs.getString("project_name"));
                tasks.add(task);
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving tasks: " + e.getMessage());
        }

        return tasks;
    }

    // Retrieve task by ID
    public Task getTaskById(int taskId) {
        String sql = "SELECT task_id, task_name, task_desc, status, project_name FROM task_tracker WHERE task_id = ?";
        Task task = null;

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, taskId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                task = new Task();
                task.setId(rs.getInt("task_id"));
                task.setName(rs.getString("task_name"));
                task.setDescription(rs.getString("task_desc"));
                task.setStatus(rs.getInt("status"));
                task.setProjectName(rs.getString("project_name"));
            }

        } catch (SQLException e) {
            System.out.println("Error retrieving task: " + e.getMessage());
        }

        return task;
    }

    // Update a task's status
    public void updateTaskStatus(int taskId, int status) {
        String sql = "UPDATE task_tracker SET status = ? WHERE task_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, status);  // 0 for incomplete | 1 for complete
            pstmt.setInt(2, taskId);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " updated successfully.");

        } catch (SQLException e) {
            System.out.println("Error updating task status: " + e.getMessage());
        }
    }

    // Delete a task by ID
    public void deleteTask(int taskId) {
        String sql = "DELETE FROM task_tracker WHERE task_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, taskId);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " deleted successfully.");

        } catch (SQLException e) {
            System.out.println("Error deleting task: " + e.getMessage());
        }
    }
}
