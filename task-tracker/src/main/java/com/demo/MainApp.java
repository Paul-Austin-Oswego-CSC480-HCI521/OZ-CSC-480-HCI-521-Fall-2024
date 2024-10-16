package com.demo;

//Testing File Not Using the Endpoints was simply used to test operations before restful endpoints were created to make sure veerything was working.

public class MainApp {

    public static void main(String[] args) {
        TaskDAO taskDAO = new TaskDAO();

        //Create a new task
        Task newTask = new Task();
        newTask.setName("Write Documentation");
        newTask.setDescription("Write detailed documentation for the project");
        newTask.setStatus(0);  // 0 for incomplete
        taskDAO.createTask(newTask);

        // Read all tasks
        System.out.println("Reading all tasks...");
        for (Task task : taskDAO.getAllTasks()) {
            System.out.println(task.getId() + ": " + task.getName() + " - " + task.getDescription() + " (Status: " + task.getStatus() + ")");
        }

        // Update task status
        System.out.println("Updating task status for task with ID 1...");
        taskDAO.updateTaskStatus(1, 1);  //setting status to 1 (complete)

        // Delete a task
        System.out.println("Deleting task with ID 1...");
        taskDAO.deleteTask(1);  //Delete task with ID 1
    }
}
