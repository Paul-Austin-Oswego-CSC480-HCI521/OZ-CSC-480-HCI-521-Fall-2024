// package piesarentsquare.rest;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.Timeout;
// import java.io.File;
// import java.io.IOException;
// import static org.junit.jupiter.api.Assertions.*;


// class LibertyServerTest {
//    // Store process to terminate it later
//    private Process frontendProcess;


//    private void runCommand(String directory, String command) throws IOException, InterruptedException {
//        ProcessBuilder builder = new ProcessBuilder(command.split(" "));
//        builder.directory(new File(directory)); // Set the working directory
//        Process process = builder.start();
//        process.waitFor();


//        int exitCode = process.exitValue();
//        assertEquals(0, exitCode, "Command failed with exit code: " + exitCode);


//        System.out.println("Command '" + command + "' executed successfully in " + directory);
//    }
//    private void runCommandInBackground(String directory, String command) throws IOException {
//        ProcessBuilder builder = new ProcessBuilder(command.split(" "));
//        builder.directory(new File(directory)); // Set the working directory
//        frontendProcess = builder.start(); // Store process for termination later


//        System.out.println("Command '" + command + "' started in background in " + directory);
//    }
//    // Send SIGINT (Ctrl+C) to the frontend process
//    private void sendSigintToProcess(Process process) throws IOException {
//        if (process != null && process.isAlive()) {
//            long pid = process.pid(); // Get PID (Requires Java 9+)
//            // Send SIGINT (Ctrl+C) to the process
//            ProcessBuilder killBuilder = new ProcessBuilder("kill", "-2", Long.toString(pid));
//            Process killProcess = killBuilder.start();
//            try {
//                killProcess.waitFor();
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//            System.out.println("Sent SIGINT (Ctrl+C) to process with PID: " + pid);
//        }
//    }
  


//    @Test
//    @Timeout(80)
//    void testStartAndStopBackendAndFrontend() {
//        try {
//            runCommand("../../backend/auth-service", "mvn liberty:start");
//            runCommand("../database-service", "mvn liberty:start");


//            runCommand("../../frontend", "npm i");
//            runCommandInBackground("../../frontend", "npm run dev");


//            Thread.sleep(30000);


//            runCommand("../../backend/auth-service", "mvn liberty:stop");
//            runCommand("../../backend/database-service", "mvn liberty:stop");
//            sendSigintToProcess(frontendProcess);


//        } catch (IOException | InterruptedException e) {
//            fail("Exception during execution: " + e.getMessage());
//        }
//    }
// }
//----------------------------------------------------------------------

// package piesarentsquare.rest;

// import io.github.bonigarcia.wdm.WebDriverManager;
// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.Timeout;
// import org.openqa.selenium.By;
// import org.openqa.selenium.WebDriver;
// import org.openqa.selenium.WebElement;
// import org.openqa.selenium.chrome.ChromeDriver;

// import java.io.File;
// import java.io.IOException;
// import java.time.Duration;

// import static org.junit.jupiter.api.Assertions.assertTrue;
// import static org.junit.jupiter.api.Assertions.fail;

// class LibertyServerTest {
//     private Process websiteProcess;
//     private WebDriver driver;

//     private void runScript(String scriptName) throws IOException, InterruptedException {
//         ProcessBuilder builder = new ProcessBuilder("bash", scriptName);
//         builder.directory(new File("/Users/danmas/Documents/GitHub/OZ-CSC-480-HCI-521-Fall-2024")); // Set working directory to project root
//         websiteProcess = builder.start();
//         int exitCode = websiteProcess.waitFor();
//         if (exitCode != 0) {
//             fail("Script " + scriptName + " failed with exit code " + exitCode);
//         }
//     }

//     @BeforeEach
//     void setUp() {
//         WebDriverManager.chromedriver().setup();
//         driver = new ChromeDriver();
//         driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
//     }

//     @AfterEach
//     void tearDown() {
//         if (driver != null) {
//             driver.quit();
//         }
//         try {
//             if (websiteProcess != null && websiteProcess.isAlive()) {
//                 new ProcessBuilder("bash", "stop_website.sh").start().waitFor(); // Run stop script
//             }
//         } catch (IOException | InterruptedException e) {
//             System.err.println("Error stopping website: " + e.getMessage());
//         }
//     }


//     @Test
//     @Timeout(80)
//     void testLoginWithGitHub() {
//         try {
//             System.out.println("Starting the website...");
//             runScript("start_website.sh");  // Start services using start_website.sh
//             Thread.sleep(10000);  // Wait for services to fully start
//             System.out.println("Website started.");

//             // Open the login page
//             driver.get("http://localhost:2080/login");

//             // Locate and click the "Log in with GitHub" button
//             WebElement githubLoginButton = driver.findElement(By.xpath("//button[contains(., 'Log in with GitHub')]"));
//             githubLoginButton.click();

//             // Verify the redirection
//             Thread.sleep(5000);  // Wait for redirection to complete
//             assertTrue(driver.getCurrentUrl().equals("http://localhost:2080"));

//         } catch (IOException | InterruptedException e) {
//             fail("Exception during execution: " + e.getMessage());
//         }
//     }
// }


package piesarentsquare.rest;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import io.github.bonigarcia.wdm.WebDriverManager;

import java.io.File;
import java.io.IOException;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

class LibertyServerTest {
    private Process authServiceProcess;
    private Process databaseServiceProcess;
    private Process frontendProcess;
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

@BeforeEach
void setUp() {
    try {
        // Initialize WebDriver for Selenium
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        System.out.println("WebDriver initialized successfully."); // Debug statement

        // Step 1: Set the environment variable
        System.out.println("Setting database path environment variable...");
        String ozDatabasePath = "jdbc:sqlite:" + new File(".").getAbsolutePath() + "/tasks.db";
        System.setProperty("OZ_DATABASE_PATH", ozDatabasePath);

        // Step 2: Run Maven install for the backend
        System.out.println("Running Maven install for the backend...");
        runCommand("../../backend", "mvn install -DskipTests");

        // Step 3: Start Authorization Service
        System.out.println("Starting Authorization Service...");
        authServiceProcess = runCommandInBackground("../../backend/auth-service", "mvn liberty:start");

        // Step 4: Start Database Service
        System.out.println("Starting Database Service...");
        databaseServiceProcess = runCommandInBackground("../database-service", "mvn liberty:start");

        // Step 5: Install npm dependencies and start frontend server
        System.out.println("Installing npm dependencies and starting frontend server...");
        runCommand("../../frontend", "npm install");
        frontendProcess = runCommandInBackground("../../frontend", "npm run dev");


    } catch (IOException | InterruptedException e) {
        fail("Exception during setup: " + e.getMessage());
    } catch (Exception e) {
        fail("Unexpected exception during WebDriver initialization: " + e.getMessage());
    }
}


    // Teardown: Stop all services
    @AfterEach
    void tearDown() {
        try {
            if (authServiceProcess != null && authServiceProcess.isAlive()) {
                System.out.println("Stopping Authorization Service...");
                runCommand("../../backend/auth-service", "mvn liberty:stop");
            }
            if (databaseServiceProcess != null && databaseServiceProcess.isAlive()) {
                System.out.println("Stopping Database Service...");
                runCommand("../database-service", "mvn liberty:stop");
            }
            if (frontendProcess != null && frontendProcess.isAlive()) {
                System.out.println("Stopping Frontend...");
                frontendProcess.destroy();  // Use destroy to send SIGTERM
                frontendProcess.waitFor();
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("Error during teardown: " + e.getMessage());
        }
    }

    // Test that verifies the setup and runs the login test
    @Test
    @Timeout(120)
    void testStartAndLogin() throws IOException {
        try {
            System.out.println("Opening login page...");
            driver.get("http://localhost:2080/Login");

            Thread.sleep(15000);

            // Locate and click the "Log in with GitHub" button
            System.out.println("Attempting to find GitHub login button...");
            WebElement githubLoginButton = driver.findElement(By.xpath("//button[contains(., 'Log in with GitHub')]"));
            System.out.println("GitHub login button found, clicking it...");
            githubLoginButton.click();

            // Verify the redirection
            System.out.println("Waiting for redirection...");
            Thread.sleep(5000);  // Wait for redirection to complete
            assertTrue(driver.getCurrentUrl().equals("http://localhost:2080"));

            WebElement githubLogoutButton = driver.findElement(By.xpath("//button[contains(., 'Log out')]"));
            System.out.println("Logout button found, clicking it...");
            githubLogoutButton.click();

        } catch (Exception e) {
            fail("Exception during execution: " + e.getMessage());
        }
    }
}



