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
    private String sqlPath;

    // Create the task_tracker table if it doesn't exist
    @PostConstruct
    private void createTableIfNotExists() {
        sqlPath = "jdbc:sqlite:" + dbPath;

        System.out.println("Attempting to construct 'task_tracker' table");
        String createTableSQL = """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                desc TEXT,
                status INTEGER DEFAULT 0,
                project_id INTEGER,
                user_email TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id),
                FOREIGN KEY (user_email) REFERENCES users(email)
            );
            """;

        // TODO: a horrible way of doing things
        String createTrashTableSQL = """
            CREATE TABLE IF NOT EXISTS trash (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                desc TEXT,
                status INTEGER DEFAULT 0,
                project_id INTEGER,
                user_email TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id),
                FOREIGN KEY (user_email) REFERENCES users(email)
            );
            """;

        try (Connection conn = DriverManager.getConnection(sqlPath);
             Statement stmt = conn.createStatement()) {
            stmt.execute(createTableSQL);
            stmt.execute(createTrashTableSQL);
            System.out.println("Table 'tasks' created or already exists.");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // Create a new task
    public Task createTask(Task task) {
        String insertTaskSql = "INSERT INTO tasks (name, desc, status, project_id, user_email) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmtInsert = conn.prepareStatement(insertTaskSql)) {

            // Insert the new task
            pstmtInsert.setString(1, task.getName());
            pstmtInsert.setString(2, task.getDescription());
            pstmtInsert.setInt(3, task.getStatus());  // 0 for incomplete | 1 for complete
            pstmtInsert.setInt(4, task.getProjectId());
            pstmtInsert.setString(5, task.getUserEmail());
            pstmtInsert.executeUpdate();

            System.out.println("Task created successfully.");

            ResultSet rs = pstmtInsert.getGeneratedKeys();
            if (rs.next())
                task.setId(rs.getInt(1));
            return task;

        } catch (SQLException e) {
            System.out.println("Error creating task: " + e.getMessage());
            return null;
        }
    }

    // Read all tasks
    public List<Task> getAllUserTasks(String userEmail) {
        String sql = "SELECT id, name, desc, status, project_id, user_email FROM tasks WHERE user_email = ?";
        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userEmail);
            ResultSet rs = pstmt.executeQuery();

            return getTasksFromQuery(rs);
        } catch (SQLException e) {
            System.out.println("Error retrieving tasks: " + e.getMessage());
        }

        return new ArrayList<>();
    }

    // Read all completed tasks
    public List<Task> getCompletedUserTasks(String userEmail) {
        String sql = "SELECT id, name, desc, status, project_id, user_email FROM tasks WHERE user_email = ? AND status = 1";
        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userEmail);
            ResultSet rs = pstmt.executeQuery();
            return getTasksFromQuery(rs);
        } catch (SQLException e) {
            System.out.println("Error retrieving tasks: " + e.getMessage());
        }

        return new ArrayList<>();
    }

    // Read all trashed tasks
    public List<Task> getTrashedUserTasks(String userEmail) {
        String sql = "SELECT id, name, desc, status, project_id, user_email FROM trash WHERE user_email = ?";
        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userEmail);
            ResultSet rs = pstmt.executeQuery();
            return getTasksFromQuery(rs);
        } catch (SQLException e) {
            System.out.println("Error retrieving tasks: " + e.getMessage());
        }

        return new ArrayList<>();
    }


    private List<Task> getTasksFromQuery(ResultSet rs) {
        List<Task> tasks = new ArrayList<>();
        try {
            while (rs.next()) {
                Task task = new Task();
                task.setId(rs.getInt("id"));
                task.setName(rs.getString("name"));
                task.setDescription(rs.getString("desc"));
                task.setStatus(rs.getInt("status"));
                task.setProjectId(rs.getInt("project_id"));
                task.setUserEmail(rs.getString("user_email"));
                tasks.add(task);
            }
        } catch (SQLException e) {
            System.out.println("Error retrieving tasks: " + e.getMessage());
        }
        return tasks;
    }

    // Retrieve task by ID
    public Task getTaskById(int taskId, String userEmail) {
        String sql = "SELECT id, name, desc, status, project_id, user_email FROM tasks WHERE id = ? AND user_email = ?";
        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, taskId);
            pstmt.setString(2, userEmail);
            ResultSet rs = pstmt.executeQuery();

            return getTasksFromQuery(rs).get(0);

        } catch (SQLException e) {
            System.out.println("Error retrieving task: " + e.getMessage());
        }

        return null;
    }

    // Read all project tasks
    public List<Task> getAllProjectTasks(int projectId, String userEmail) {
        String sql = "SELECT id, name, desc, status, project_id, user_email FROM tasks WHERE project_id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, projectId);
            pstmt.setString(2, userEmail);
            ResultSet rs = pstmt.executeQuery();

            return getTasksFromQuery(rs);

        } catch (SQLException e) {
            System.out.println("Error retrieving tasks: " + e.getMessage());
        }

        return new ArrayList<>();
    }

    // Update a task's status
    public void updateTask(int taskId, Task updated, String userEmail) {
        String sql = "UPDATE tasks SET name = ?, desc = ?, status = ?, project_id = ? WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, updated.getName());
            pstmt.setString(2, updated.getDescription());
            pstmt.setInt(3, updated.getStatus()); // 0 for incomplete | 1 for complete
            pstmt.setInt(4, updated.getProjectId());
            pstmt.setInt(5, taskId);
            pstmt.setString(6, userEmail);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " updated successfully.");

        } catch (SQLException e) {
            System.out.println("Error updating task: " + e.getMessage());
        }
    }

    // Trash a task by ID
    public void trashTask(int taskId, String userEmail) {
        String insertSql = """
            INSERT INTO trash (id, name, desc, status, project_id, user_email)
                SELECT id, name, desc, status, project_id, user_email
                FROM tasks
                WHERE id = ? AND user_email = ?;
            """;
        String deleteSql = "DELETE FROM tasks WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(dbPath)) {
            conn.setAutoCommit(false);
            try (PreparedStatement insertStmt = conn.prepareStatement(insertSql);
                 PreparedStatement deleteStmt = conn.prepareStatement(deleteSql)) {

                insertStmt.setInt(1, taskId);
                insertStmt.setString(2, userEmail);
                insertStmt.executeUpdate();

                deleteStmt.setInt(1, taskId);
                deleteStmt.setString(2, userEmail);
                deleteStmt.executeUpdate();

                conn.commit();
                System.out.println("Task with ID " + taskId + " trashed.");

            } catch (SQLException e) {
                conn.rollback();
                System.out.println("Transaction rolled back due to: " + e.getMessage());
            }
        } catch (SQLException e) {
            System.out.println("Error trashing task: " + e.getMessage());
        }
    }

    // Restore a task by ID
    public void restoreTask(int taskId, String userEmail) {
        String insertSql = """
            INSERT INTO tasks (id, name, desc, status, project_id, user_email)
                SELECT id, name, desc, status, project_id, user_email
                FROM trash
                WHERE id = ? AND user_email = ?;
            """;
        String deleteSql = "DELETE FROM trash WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(dbPath)) {
            conn.setAutoCommit(false);
            try (PreparedStatement insertStmt = conn.prepareStatement(insertSql);
                 PreparedStatement deleteStmt = conn.prepareStatement(deleteSql)) {

                insertStmt.setInt(1, taskId);
                insertStmt.setString(2, userEmail);
                insertStmt.executeUpdate();

                deleteStmt.setInt(1, taskId);
                deleteStmt.setString(2, userEmail);
                deleteStmt.executeUpdate();

                conn.commit();
                System.out.println("Task with ID " + taskId + " restored.");

            } catch (SQLException e) {
                conn.rollback();
                System.out.println("Transaction rolled back due to: " + e.getMessage());
            }
        } catch (SQLException e) {
            System.out.println("Error restoring task: " + e.getMessage());
        }
    }

    // Delete a task by ID
    private void deleteTask(int taskId, String userEmail) {
        String sql = "DELETE FROM tasks WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(dbPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, taskId);
            pstmt.setString(2, userEmail);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " deleted from active tasks.");

        } catch (SQLException e) {
            System.out.println("Error deleting task: " + e.getMessage());
        }
    }

    // Delete a task by ID from trash
    public void deleteTrashTask(int taskId, String userEmail) {
        String sql = "DELETE FROM trash WHERE id = ? AND user_email = ?";

        try (Connection conn = DriverManager.getConnection(sqlPath);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, taskId);
            pstmt.setString(2, userEmail);
            pstmt.executeUpdate();
            System.out.println("Task with ID " + taskId + " deleted from active tasks.");

        } catch (SQLException e) {
            System.out.println("Error deleting task: " + e.getMessage());
        }
    }
}