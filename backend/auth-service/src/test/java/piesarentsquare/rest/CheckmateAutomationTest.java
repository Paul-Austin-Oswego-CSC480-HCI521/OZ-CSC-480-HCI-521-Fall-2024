package piesarentsquare.rest;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CheckmateAutomationTest {
    private static WebDriver driver;
    private static WebDriverWait wait;
    static String email = System.getenv("CSC480_TEST_EMAIL");
    static String password = System.getenv("CSC480_TEST_PASSWORD");

    // Sets up the WebDriver, WebDriverWait, and environment variable assertions.
    @BeforeAll
    static void setUp() {
        assertNotNull(email, "CSC480_TEST_EMAIL environment variable must be set");
        assertNotNull(password, "CSC480_TEST_PASSWORD environment variable must be set");

        WebDriverManager.chromedriver().setup();

        /**
         * **************************************************************************************************
         * WARNING: ONLY USE THIS SSL CERTIFICATE BYPASS FOR LOCAL TESTING!
         * 
         * Make sure to chnage this before testing the hosted server to avoid security risks.
         * **************************************************************************************************
         */

        // Set Chrome options to bypass certificate errors
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--ignore-certificate-errors");
        options.addArguments("--allow-insecure-localhost");

        // Initialize the WebDriver with the Chrome options
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            if (driver != null) {
                driver.quit();
            }
        }));
    }

    // ---------- Here is the non-bypassing setup ----------

    // // Sets up the WebDriver, WebDriverWait, and environment variable assertions.
    // @BeforeAll
    // static void setUp() {
    //     assertNotNull(email, "CSC480_TEST_EMAIL environment variable must be set");
    //     assertNotNull(password, "CSC480_TEST_PASSWORD environment variable must be set");

    //     WebDriverManager.chromedriver().setup();
    //     driver = new ChromeDriver();
    //     driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    //     wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    //     Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    //         if (driver != null) {
    //             driver.quit();
    //         }
    //     }));
    // }

    // Adds a delay after each test for stability.
    @AfterEach
    void addDelayAfterTest() throws InterruptedException {
        Thread.sleep(2000);
    }

    // Navigates to the login page and checks if the URL contains "login".
    @Test
    @Order(1)
    void navigateToSite() {
        driver.get("http://localhost:2080/login");
        
        wait.until(ExpectedConditions.urlContains("login"));
        assertTrue(driver.getCurrentUrl().contains("login"), 
            "Failed to load login page: Current URL does not contain 'login'");
        
        WebElement loginButton = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//button[contains(., 'Log in with GitHub')]")));
        assertTrue(loginButton.isDisplayed(), 
            "Login page did not load properly: GitHub login button not visible");
    }


    // Checks that the Sign-Up button navigates to the registration page.
    @Test
    @Order(2)
    void loginPageSignUpButton() {
        WebElement signUpButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[@href='/Registration' and text()='Sign Up ']")));
        
        signUpButton.click();

        wait.until(ExpectedConditions.urlContains("/Registration"));
        assertTrue(driver.getCurrentUrl().endsWith("/Registration"),
            "Failed to redirect to registration page after clicking sign up");
    }

    // Inputs the email into the registration form and verifies it was entered correctly.
    @Test
    @Order(4)
    void enterRegistrationEmail() {
        WebElement emailInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("email")));
        
        emailInput.sendKeys(email);
        
        assertEquals(email, emailInput.getAttribute("value"),
            "Email was not properly entered into the field");
    }
    
    // Inputs the password into the registration form and verifies it was entered correctly.
    @Test
    @Order(5)
    void enterRegistrationPassword() {
        WebElement passwordInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("password")));
        
        passwordInput.sendKeys(password);
        
        assertFalse(passwordInput.getAttribute("value").isEmpty(),
            "Password field is empty");
    }
    
    // Inputs the confirmation password into the registration form and verifies it was entered correctly.
    @Test
    @Order(6)
    void enterRegistrationConfirmPassword() {
        WebElement confirmPasswordInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("confirmPassword")));
    
        confirmPasswordInput.sendKeys(password);
    
        assertFalse(confirmPasswordInput.getAttribute("value").isEmpty(),
            "Confirm Password field is empty");
    }

    // Clicks the "Sign Up" button and verifies the action was performed.
    @Test
    @Order(7)
    void clickSignUpButton() throws InterruptedException {
        WebElement signUpButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("button[type='submit']")));
        
        signUpButton.click();
        
        wait.until(ExpectedConditions.urlContains("/login"));

        assertTrue(driver.getCurrentUrl().endsWith("/login"),
            "Failed to redirect to login page after clicking sign up");
    }

    // Inputs the email into the login form and verifies it was entered correctly.
    @Test
    @Order(8)
    void enterLoginEmail() {
        
        WebElement emailInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("email")));
        
        emailInput.sendKeys(email);
        
        assertEquals(email, emailInput.getAttribute("value"),
            "Email was not properly entered into the field");
    }
    
    // Inputs the password into the login form and verifies it was entered correctly.
    @Test
    @Order(9)
    void enterLoginPassword() {
        WebElement passwordInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("password")));
        
        passwordInput.sendKeys(password);
        
        assertFalse(passwordInput.getAttribute("value").isEmpty(),
            "Password field is empty");
    }

    // Clicks the "Log in" button and verifies the action was performed.
    @Test
    @Order(10)
    void clickLoginButton() throws InterruptedException {
        WebElement loginButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[@type='submit' and text()='Log in']")));
        
        loginButton.click();
        
        // Edit this below - may want to use something different to wait for...
        wait.until(ExpectedConditions.urlContains("/"));
        Thread.sleep(2000);
        assertTrue(driver.getCurrentUrl().endsWith("/"),
            "Failed to redirect to homepage after clicking login");
    }

    // Clicks the "Checkmate" and verifies the URL after the was performed.
    @Test
    @Order(11)
    void clickCheckmateButton() {
        WebElement checkmateButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[@title='Home' and contains(@class, 'flex')]")));
        
        checkmateButton.click();
        
        wait.until(ExpectedConditions.urlContains("/"));
        assertTrue(driver.getCurrentUrl().endsWith("/"),
            "Failed to redirect to homepage after clicking login");
    }

    // Creates a project for i amount of times.
    @Test
    @Order(12)
    void createProject() throws InterruptedException {
        // Locate the button using the provided CSS selector
        WebElement projectButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(@class, 'inline-flex') and contains(@class, 'absolute') and @class[contains(., 'hover:bg-neutral-50')]]")));
    
        // Click the button i amount of times with a delay in between
        for (int i = 0; i < 3; i++) {
            projectButton.click();
            Thread.sleep(2000);
        }
    }

    // Function to create a task
    void createTask(String taskName, String description, String projectName, String dueDate, String priority) {

        // Fill out task details
        WebElement taskNameInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@type='text' and @placeholder='Task Title']")));
            taskNameInput.clear();
        taskNameInput.sendKeys(taskName, Keys.TAB);
        taskNameInput.sendKeys(Keys.TAB);

        WebElement descriptionInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//textarea[@placeholder='Description']")));
            descriptionInput.clear();
        descriptionInput.sendKeys(description);         

        WebElement projectDropdown = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("projects-option")));
        projectDropdown.click();
        WebElement projectOption = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//option[text()='" + projectName + "']")));
        projectOption.click();

        WebElement dueDateInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("date-option")));
        dueDateInput.sendKeys(dueDate);
        

        WebElement priorityDropdown = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("priority-option")));
        priorityDropdown.click();
        WebElement priorityOption = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//option[text()='" + priority + "']")));
        priorityOption.click();

        WebElement saveChangesButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[text()='Add New Task']")));
        saveChangesButton.click();
    }

    // Verifies a task is present in the table with correct details.
    void verifyTask(String taskName, String projectName, String dueDate, String priority) {
        // Wait for the task table to contain the new task with the provided details
        WebElement taskRow = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//tr[contains(@class, 'border-b') and .//span[text()='" + taskName + "']]")));
        
        // Extract details from the located row
        String actualTaskName = taskRow.findElement(By.xpath(".//span[text()='" + taskName + "']")).getText();
        String actualProjectName = taskRow.findElement(By.xpath(".//span[text()='" + projectName + "']")).getText();
        String actualDueDate = taskRow.findElement(By.xpath(".//span[text()='" + dueDate + "']")).getText();
        String actualPriority = taskRow.findElement(By.xpath(".//span[text()='" + priority + "']")).getText();

        // Assertions to verify details match
        assertEquals(taskName, actualTaskName, "Task name does not match");
        assertEquals(projectName, actualProjectName, "Project name does not match");
        assertEquals(dueDate, actualDueDate, "Due date does not match");
        assertEquals(priority, actualPriority, "Priority does not match");
    }

    // Verifies a task is present in the table with correct details.
    void verifyProjectTask(String taskName, String dueDate, String priority) {
        // Wait for the task table to contain the new task with the provided details
        WebElement taskRow = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//tr[contains(@class, 'border-b') and .//span[text()='" + taskName + "']]")));
        
        // Extract details from the located row
        String actualTaskName = taskRow.findElement(By.xpath(".//span[text()='" + taskName + "']")).getText();
        String actualDueDate = taskRow.findElement(By.xpath(".//span[text()='" + dueDate + "']")).getText();
        String actualPriority = taskRow.findElement(By.xpath(".//span[text()='" + priority + "']")).getText();

        // Assertions to verify details match
        assertEquals(taskName, actualTaskName, "Task name does not match");
        assertEquals(dueDate, actualDueDate, "Due date does not match");
        assertEquals(priority, actualPriority, "Priority does not match");
    }

    // Creates and verifies "Finish Gift Wrapping" using "Low" priority
    @Test
    @Order(13)
    void createAndVerifyTask1() {
        createTask("Finish Gift Wrapping", "Wrap the remaining gifts for family and friends.", "Project 3", "12152024", "Low");
        verifyTask("Finish Gift Wrapping", "Project 3", "12 / 15 / 2024", "Low");
    }

    // Creates and verifies "Organize Team Lunch" using "Medium" priority
    @Test
    @Order(14)
    void createAndVerifyTask2() {
        createTask("Organize Team Lunch", "Book a restaurant and send invites to the team.", "Project 3", "12162024", "Medium");
        verifyTask("Organize Team Lunch", "Project 3", "12 / 16 / 2024", "Medium");
    }

    // Creates and verifies "Send Holiday Cards" using "High" priority
    @Test
    @Order(15)
    void createAndVerifyTask3() {
        createTask("Send Holiday Cards", "Write and mail personalized holiday cards to clients.", "Project 4", "12172024", "High");
        verifyTask("Send Holiday Cards", "Project 4", "12 / 17 / 2024", "High");
    }

    // Creates and verifies "Prepare for New Year" using "No Priority"
    @Test
    @Order(16)
    void createAndVerifyTask4() {
        createTask("Prepare for New Year", "Buy decorations and finalize plans for the New Year party.", "Project 4", "12182024", "No Priority");
        verifyTask("Prepare for New Year", "Project 4", "12 / 18 / 2024", "No Priority");
    }

    @Test
    @Order(17)
    void verifyProject3Tasks() throws InterruptedException {
    
        // Locate and click the "Project 3" link using its href
        WebElement project3Button = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("a[href='/project/3']")));
        project3Button.click();

        Thread.sleep(1000);
    
        // Verify tasks for Project 3
        verifyProjectTask("Finish Gift Wrapping", "12 / 15 / 2024", "Low");
        verifyProjectTask("Organize Team Lunch", "12 / 16 / 2024", "Medium");
    }
    
    @Test
    @Order(18)
    void verifyProject4Tasks() throws InterruptedException {

        // Locate and click the "Project 4" link using its href
        WebElement project3Button = wait.until(ExpectedConditions.elementToBeClickable(
            By.cssSelector("a[href='/project/4']")));
        project3Button.click();

        Thread.sleep(1000);
    
        // Verify tasks for Project 4
        verifyProjectTask("Send Holiday Cards", "12 / 17 / 2024", "High");
        verifyProjectTask("Prepare for New Year", "12 / 18 / 2024", "No Priority");
    }

    @Test
    @Order(19)
    void myTasksButton() {
        // Wait until the 'My Tasks' button is clickable
        WebElement myTasksButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//a[normalize-space(text())='My Tasks']")));
        
        // Click the 'My Tasks' button
        myTasksButton.click();
        
        // Verify that the current URL contains the expected endpoint "/"
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.endsWith("/"), "The URL should end with '/' after clicking 'My Tasks'");
    } 

    void editTask(String oldTaskName, String newTaskName, String newDescription, String newProjectName, String newDueDate, String newPriority) {
        // Locate the task to be edited by its old name
        WebElement taskElement = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//span[text()='" + oldTaskName + "']")));
        taskElement.click();
    
        // Wait for the task details to load (this depends on how your app behaves)
        WebElement taskNameInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@type='text' and @placeholder='Task Title']")));
        taskNameInput.clear();
        taskNameInput.sendKeys(newTaskName, Keys.TAB);  // Edit task name
    
        WebElement descriptionInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//textarea[@placeholder='Description']")));
        descriptionInput.clear();
        descriptionInput.sendKeys(newDescription);  // Edit task description
    
        WebElement projectDropdown = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("projects-option")));
        projectDropdown.click();
        WebElement projectOption = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//option[text()='" + newProjectName + "']")));
        projectOption.click();  // Select the new project
    
        WebElement dueDateInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("date-option")));
        dueDateInput.clear();
        dueDateInput.sendKeys(newDueDate);  // Edit due date
    
        WebElement priorityDropdown = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("priority-option")));
        priorityDropdown.click();
        WebElement priorityOption = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//option[text()='" + newPriority + "']")));
        priorityOption.click();  // Select the new priority
    
        // Click on the "Save Changes" button
        WebElement saveChangesButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[text()='Save Changes']")));
        saveChangesButton.click();  // Save the changes to the task
    }    

    @Test
    @Order(20)
    void editTask() {
        editTask("Finish Gift Wrapping", "Finish Gift Wrapping - Updated", "Wrap the remaining gifts for family and friends, including some last-minute additions.", "Project 4", "12152024", "Low");
        verifyTask("Finish Gift Wrapping - Updated", "Project 4", "12 / 15 / 2024", "Low");
    } 
    

    void checkOffTask(String taskName) throws InterruptedException {
    // Wait for the task's checkbox button to be available and clickable
    WebElement taskCheckbox = wait.until(ExpectedConditions.elementToBeClickable(
        By.xpath("//tr[td//span[normalize-space(text())='" + taskName + "']]//button[@role='checkbox']")));
    
        // Click the checkbox button to mark the task as checked
        taskCheckbox.click();

        Thread.sleep(3000);
    }
    
    @Test
    @Order(21)
    void checkOffTask1() throws InterruptedException {
        // Check off task
        checkOffTask("Finish Gift Wrapping - Updated");
    }

    @Test
    @Order(22)
    void checkOffTask2() throws InterruptedException {
        // Check off task
        checkOffTask("Organize Team Lunch");
    }

    @Test
    @Order(23)
    void verifyCheckOffTasks1() {
    
        // Wait for the "Completed" button to be clickable and click it
        WebElement completedButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[text()='Completed']")));
        completedButton.click();
    
        // Verify the task is now marked as completed
        verifyTask("Finish Gift Wrapping - Updated", "Project 4", "12 / 15 / 2024", "Low");
        verifyTask("Organize Team Lunch", "Project 3", "12 / 16 / 2024", "Medium");
    }
    
    @Test
    @Order(24)
    void uncheckTask1() throws InterruptedException {
        // Check off task
        checkOffTask("Finish Gift Wrapping - Updated");
    }

    @Test
    @Order(25)
    void uncheckTask2() throws InterruptedException {
        // Check off task
        checkOffTask("Organize Team Lunch");
    }
    
    @Test
    @Order(26)
    void clickUpcomingButton() {
    
        // Wait until the 'Upcoming' button is clickable
        WebElement upcomingButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[normalize-space(text())='Upcoming']")));
    
        // Click the 'Upcoming' button
        upcomingButton.click();
    }

    @Test
    @Order(27)
    void verifycheckOffTasks2() {
        // Verify the task is now marked as not completed
        verifyTask("Finish Gift Wrapping - Updated", "Project 4", "12 / 15 / 2024", "Low");
        verifyTask("Organize Team Lunch", "Project 3", "12 / 16 / 2024", "Medium");
    }

    void deleteTask(String TaskName) {
        // Locate the task to be edited by its old name
        WebElement taskElement = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//span[text()='" + TaskName + "']")));
        taskElement.click();
    
        // Click on the "Delete Task" button
        WebElement deleteTaskButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[text()='Delete Task']")));
        deleteTaskButton.click();

        // Wait for the confirmation "Delete" button to be clickable
        WebElement confirmDeleteButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[text()='Delete']")));

        // Click the confirmation "Delete" button
        confirmDeleteButton.click();
    }

    @Test
    @Order(28)
    void deleteAndVerifyTask1() {
        // Delete "Prepare for New Year"
        deleteTask("Prepare for New Year");
        
        // Verify the task is no longer visible
        boolean isTaskInvisible = wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.xpath("//span[text()='Prepare for New Year']")));
        assertTrue(isTaskInvisible, "Task 'Prepare for New Year' should not be displayed.");
    }

    @Test
    @Order(29)
    void deleteAndVerifyTask2() {
        // Delete "Send Holiday Cards"
        deleteTask("Send Holiday Cards");
        
        // Verify the task is no longer visible
        boolean isTaskInvisible = wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.xpath("//span[text()='Send Holiday Cards']")));
        assertTrue(isTaskInvisible, "Task 'Send Holiday Cards' should not be displayed.");
    }

    void deleteProject(String projectName) {
        // Locate the project by its name
        WebElement projectElement = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//span[text()='" + projectName + "']")));
        projectElement.click();
    
        // Locate the delete button next to the project
        WebElement deleteButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[@class='w-9 h-9 rounded-md flex items-center justify-center hover:bg-gray-200']")));
        deleteButton.click();
    }
    
    @Test
    @Order(30)
    void deleteAndVerifyProject1() {
        // Delete the project "Default Project"
        deleteProject("Default Project");
    
        // Verify the project is no longer visible
        boolean isProjectInvisible = wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.xpath("//span[text()='Default Project']")));
        assertTrue(isProjectInvisible, "Project 'Default Project' should not be displayed.");
    }

    @Test
    @Order(31)
    void deleteAndVerifyProject2() {
        // Delete the project "Project 3"
        deleteProject("Project 2");
    
        // Verify the project is no longer visible
        boolean isProjectInvisible = wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.xpath("//span[text()='Project 2']")));
        assertTrue(isProjectInvisible, "Project 'Project 2' should not be displayed.");
    }
    

    @Test
    @Order(32)
    void recentlyDeletedButton() {
        // Wait until the 'Recently Deleted' button is clickable
        WebElement recentlyDeletedButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//a[normalize-space(text())='Recently Deleted']")));
        
        // Click the 'Recently Deleted' button
        recentlyDeletedButton.click();
        
        // Verify that the current URL contains the expected endpoint "/"
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.endsWith("/deleted"), "The URL should end with '/deleted' after clicking 'Recently Deleted'");
    } 

    void deleteItemPermanently(String itemName) {
        // Locate the row containing the item name
        WebElement itemRow = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//span[text()='" + itemName + "']")));
        itemRow.click();
    
        // Wait for the "Delete Permanently" button within the row and click it
        WebElement deletePermanentlyButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//span[text()='" + itemName + "']/ancestor::tr//button[text()='Delete Permanently']")));
        deletePermanentlyButton.click();
    }
    

    void recoverItem(String itemName) {
        // Locate the row containing the item name
        WebElement itemRow = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//span[text()='" + itemName + "']")));
        itemRow.click();
    
        // Locate the "Recover" button within the same row and click it
        WebElement recoverButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//span[text()='" + itemName + "']/ancestor::tr//button[contains(text(), 'Recover')]")));
        recoverButton.click();
    }
    

    @Test
    @Order(33)
    void deleteAndVerifyTaskPermanently() {
        // Delete the task
        deleteItemPermanently("Prepare for New Year");
    
        // Verify the task is no longer visible in the Recently Deleted section
        boolean isTaskInvisible = wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.xpath("//span[text()='Prepare for New Year']")));
        assertTrue(isTaskInvisible, "Task 'Prepare for New Year' should not be displayed in the Recently Deleted section.");
    }

    @Test
    @Order(34)
    void deleteAndVerifyProjectPermanently() {
        // Delete the project
        deleteItemPermanently("Project 2");
    
        // Verify the project is no longer visible in the Recently Deleted section
        boolean isTaskInvisible = wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.xpath("//span[text()='Project 2']")));
        assertTrue(isTaskInvisible, "Project 'Project 2' should not be displayed in the Recently Deleted section.");
    }
    

    @Test
    @Order(35)
    void recoverAndVerifyTask() {
        // Recover the task
        recoverItem("Send Holiday Cards");
    
        // Wait until the 'My Tasks' button is clickable
        WebElement myTasksButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[normalize-space(text())='My Tasks']")));
        
        // Click the 'My Tasks' button
        myTasksButton.click();

        // Verify Task in 'My Tasks'
        verifyTask("Send Holiday Cards", "Project 4", "12 / 17 / 2024", "High");

        // Wait until the 'Recently Deleted' button is clickable
        WebElement recentlyDeletedButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[normalize-space(text())='Recently Deleted']")));
        
        // Click the 'Recently Deleted' button
        recentlyDeletedButton.click();
    }

    @Test
    @Order(36)
    void recoverAndVerifyProject() {
        // Recover the task
        recoverItem("Default Project");
    
        // Wait until the 'My Tasks' button is clickable
        WebElement myTasksButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[normalize-space(text())='My Tasks']")));
    
        // Click the 'My Tasks' button
        myTasksButton.click();
    
        // Verify that the project is visible on the screen
        WebElement projectElement = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//*[contains(text(), 'Default Project')]")));        
    
        // Assert that the project is displayed
        assertTrue(projectElement.isDisplayed(), "The project is not displayed on the screen.");
    }

    // Logs out by clicking the logout button and verifies redirection to the login page.
    @Test
    @Order(37)
    void logoutButton() {
        // Locate the logout button using the visible text "Log out"
        WebElement logoutButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[text()='Log out']")));
        
        logoutButton.click();
        
        wait.until(ExpectedConditions.urlContains("/login"));
        assertTrue(driver.getCurrentUrl().endsWith("/login"),
            "Failed to redirect to login page after clicking logout");
    }

    // Tears down the WebDriver after all tests complete.
    @AfterAll
    static void tearDown() {
        if (driver != null) {
            driver.quit();
        }

        System.out.println("Thank you for testing CheckMate!");
    }
}