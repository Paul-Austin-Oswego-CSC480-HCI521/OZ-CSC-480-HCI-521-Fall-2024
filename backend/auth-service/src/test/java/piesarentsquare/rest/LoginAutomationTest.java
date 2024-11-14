package piesarentsquare.rest;

// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
// import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

class LoginAutomationTest {
    private WebDriver driver;

    private void runCommand(String directory, String command) throws IOException, InterruptedException {
        ProcessBuilder builder = new ProcessBuilder(command.split(" "));
        builder.directory(new File(directory)); // Set the working directory
        Process process = builder.start();
        int exitCode = process.waitFor();

        assertEquals(0, exitCode, "Command '" + command + "' failed with exit code: " + exitCode);
        System.out.println("Command '" + command + "' executed successfully in " + directory);
    }

    private Process runCommandInBackground(String directory, String command) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(command.split(" "));
        builder.directory(new File(directory)); // Set the working directory
        Process process = builder.start(); // Start process in background
        System.out.println("Command '" + command + "' started in background in " + directory);
        return process;
    }

        // Method to send SIGINT (Ctrl+C) to a process
    private void sendSigintToProcess(Process process) throws IOException {
        if (process != null && process.isAlive()) {
            long pid = process.pid(); // Get PID (Java 9+)
            ProcessBuilder killBuilder = new ProcessBuilder("kill", "-2", Long.toString(pid));
            Process killProcess = killBuilder.start();
            try {
                killProcess.waitFor();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Sent SIGINT (Ctrl+C) to process with PID: " + pid);
        }
    }

    @Test
    @Timeout(120)
    void testStartAndLogin() throws IOException, InterruptedException {
        Process websiteProcess = null;
        System.out.println("Running start_website script...");
        websiteProcess = runCommandInBackground("../../", "bash start_website.sh");
        // Initialize WebDriver for Selenium
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        System.out.println("WebDriver initialized successfully."); // Debug statement
        try {
            Thread.sleep(8000);
            System.out.println("Opening login page...");
            driver.get("http://localhost:2080/Login");

            Thread.sleep(20000);

            // Locate and click the "Log in with GitHub" button
            System.out.println("Attempting to find GitHub login button...");
            WebElement githubLoginButton = driver.findElement(By.xpath("//button[contains(., 'Log in with GitHub')]"));
            System.out.println("GitHub login button found, clicking it...");
            githubLoginButton.click();

            Thread.sleep(2000);

            System.out.println("Attempting to find Advanced button...");
            WebElement advanced_Button = driver.findElement(By.xpath("//button[contains(., 'Advanced')]"));
            System.out.println("Advanced button found, clicking it...");
            advanced_Button.click();

            Thread.sleep(2000);

            System.out.println("Attempting to find Proceed text...");
            WebElement proceed_Button = driver.findElement(By.xpath("//*[contains(text(), 'Proceed to localhost (unsafe)')]"));
            proceed_Button.click();

            Thread.sleep(24000);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(6));

            // Step 1: Click the "Create New Task" button
            System.out.println("Clicking 'Create New Task' button...");
            WebElement createTaskButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Create New Task')]")));
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", createTaskButton);
    
            WebElement titleField = driver.findElement(By.xpath("//input[@placeholder='Task 1']"));
            titleField.sendKeys("Automated Task Title");

            // Step 3: Enter Task Description
            System.out.println("Entering Task Description...");
            WebElement descriptionBox = driver.findElement(By.id("descriptionBox"));
            descriptionBox.click();
            descriptionBox.sendKeys("This is a description for an automated task.");

            // // Step 4: Select Project from Dropdown
            // System.out.println("Selecting Project...");
            // Select projectDropdown = new Select(driver.findElement(By.id("projects-option")));
            // projectDropdown.selectByVisibleText("Not my first rodeo"); // or select by value if you have dynamic options

            // Step 5: Set the Due Date
            System.out.println("Setting Due Date...");
            WebElement dateOption = driver.findElement(By.id("date-option"));
            dateOption.sendKeys("04052024");

            // Step 6: Set Priority
            System.out.println("Selecting Priority...");
            Select priorityDropdown = new Select(driver.findElement(By.id("priority-option")));
            priorityDropdown.selectByVisibleText("Medium");

            // Step 7: Click Save Changes Button
            System.out.println("Saving new task...");
            WebElement saveButton = driver.findElement(By.xpath("//button[contains(., 'Save Changes')]"));
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", saveButton);

            Thread.sleep(4000);

            // // Optional: Wait and verify if the task was created successfully
            // System.out.println("Verifying task creation...");
            // wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(., 'My Tasks')]"))); // Or another element that confirms success

            // System.out.println("New task created successfully.");

            // System.out.println("Attempting to find Passkey text...");
            // WebElement passkey_Button = driver.findElement(By.xpath("//*[contains(text(), 'Sign in with a passkey')]"));
            // System.out.println("Proceed button found, clicking it...");
            // passkey_Button.click();

            // Thread.sleep(10000);

            // Locate email input and enter the username
            // WebElement emailInput = driver.findElement(By.id("Username or email address"));
            // emailInput.sendKeys("user@gmail.com");

            // // Locate password input and enter the password
            // WebElement passwordInput = driver.findElement(By.id("password"));
            // passwordInput.sendKeys("password");

            // Click the login button
            // WebElement loginButton = driver.findElement(By.xpath("//button[@type='submit']"));
            // loginButton.click();

            // Check that the login was successful by verifying if the user was redirected
            // assertTrue(driver.getCurrentUrl().endsWith("/")); // Expected URL after login

            // Verify the redirection
            // System.out.println("Waiting for redirection...");
            // Thread.sleep(5000);  // Wait for redirection to complete
            // assertTrue(driver.getCurrentUrl().equals("http://localhost:2080"));

            // WebElement githubLogoutButton = driver.findElement(By.xpath("//*[contains(text(), 'Log out')]"));
            // System.out.println("Logout button found, clicking it...");
            // githubLogoutButton.click();
            WebElement githubLogoutButton = driver.findElement(By.xpath("//*[contains(text(), 'Log out')]"));
            System.out.println("Logout button found, attempting JavaScript click...");
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", githubLogoutButton);
            Thread.sleep(3000);
            runCommand("../../", "bash stop_website.sh");


        } finally {
            // Stop the website process by sending a SIGINT
            try {
                Thread.sleep(8000);
                sendSigintToProcess(websiteProcess);
            } catch (IOException e) {
                System.err.println("Error stopping website process: " + e.getMessage());
            }

            // Quit WebDriver
            if (driver != null) {
                driver.quit();
            }
        }
    }
}
        
    
