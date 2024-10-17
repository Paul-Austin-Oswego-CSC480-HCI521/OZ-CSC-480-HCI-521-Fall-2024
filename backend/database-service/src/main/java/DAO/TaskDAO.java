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
    @ConfigProperty(name = "database.path.tasks")
    private String dbPath;

    //create the 'task_tracker' table if it doesn't exist
    @PostConstruct
    private void createTableIfNotExists() {
        System.out.println("attempting to construct table");
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS task_tracker (
                    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    task_name TEXT NOT NULL,
                    task_desc TEXT,
                    status INTEGER DEFAULT 0,
                    project_id INTEGER
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

    //CREATE a new task
    public void createTask(Task task) {
        String sql = "INSERT INTO task_tracker (task_name, task_desc, status) VALUES (?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, task.getName());
            pstmt.setString(2, task.getDescription());
            pstmt.setInt(3, task.getStatus());  // 0 for incomplete | 1 for complete
            pstmt.setInt(4, task.getProject_Id());
            pstmt.executeUpdate();
            System.out.println("Task created successfully In The 'task_tracker' Table.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    //READ all tasks
    public List<Task> getAllTasks() {
        String sql = "SELECT task_id, task_name, task_desc, status, project_id FROM task_tracker";
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
                task.setProject_Id(rs.getInt("project_id"));
                tasks.add(task);
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return tasks;
    }

    //Retrieve task by ID
    public Task getTaskById(int taskId) {
        String sql = "SELECT task_id, task_name, task_desc, status, project_id FROM task_tracker WHERE task_id = ?";
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
                task.setProject_Id(rs.getInt("project_id"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return task;
    }

    //UPDATE a tasks status
    public void updateTaskStatus(int taskId, int status) {
        String sql = "UPDATE task_tracker SET status = ? WHERE task_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, status);  //0 for incomplete | 1 for complete
            pstmt.setInt(2, taskId);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " Updated Successfully.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    //DELETE a task by ID
    public void deleteTask(int taskId) {
        String sql = "DELETE FROM task_tracker WHERE task_id = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, taskId);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " Deleted Successfully.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}
