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
        
        wait.until(ExpectedConditions.urlContains("/Login"));

        assertTrue(driver.getCurrentUrl().endsWith("/Login"),
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
    void clickLoginButton() {
        WebElement loginButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[@type='submit' and text()='Log in']")));
        
        loginButton.click();
        
        wait.until(ExpectedConditions.urlContains("/"));
        assertTrue(driver.getCurrentUrl().endsWith("/"),
            "Failed to redirect to task page after clicking login");
    }

    @Test
    @Order(10)
    void createProject() {
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(@class, 'inline-flex') and contains(@class, 'items-center') and contains(@class, 'justify-center')]")));

        // Click the button five times
        for (int i = 0; i < 5; i++) {
            button.click();
        }
    }


    // Function to create a task
    void createTask(String taskName, String description, String projectName, String dueDate, String priority) {
        // Click "Create New Task" button
        WebElement createNewTaskButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[text()='Create New Task']")));
        createNewTaskButton.click();

        // Fill out task details
        WebElement taskNameInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@type='text' and @placeholder='Task Title']")));
        taskNameInput.sendKeys(taskName);
        taskNameInput.sendKeys(Keys.TAB);
        taskNameInput.sendKeys(Keys.ENTER);

        WebElement descriptionInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//textarea[@placeholder='Description']")));
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
            By.xpath("//button[text()='Save Changes']")));
        saveChangesButton.click();
    }

    // Verifies a task is present in the table with correct details
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

    // Creates and verifies Task 1
    @Test
    @Order(11)
    void createAndVerifyTask1() {
        createTask("Task 1", "Description 1", "Project 1", "12252024", "Low");
        verifyTask("Task 1", "Project 1", "12 / 25 / 2024", "Low");
    }

    // Creates and verifies Task 2
    @Test
    @Order(12)
    void createAndVerifyTask2() {
        createTask("Task 2", "Description 2", "Project 1", "12262024", "Medium");
        verifyTask("Task 2", "Project 1", "12 / 26 / 2024", "Medium");
    }
    
    // Creates and verifies Task 3
    @Test
    @Order(12)
    void createAndVerifyTask3() {
        createTask("Task 3", "Description 3", "Project 2", "12272024", "High");
        verifyTask("Task 3", "Project 2", "12 / 27 / 2024", "High");
    }

    // Creates and verifies Task 4
    @Test
    @Order(12)
    void createAndVerifyTask4() {
        createTask("Task 4", "Description 4", "Project 2", "12282024", "No Priority");
        verifyTask("Task 4", "Project 2", "12 / 28 / 2024", "No Priority");
    }

    // Tears down the WebDriver after all tests complete.
    @AfterAll
    static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
        System.out.println("CheckMate testing completed successfully!");
    }
}

// ---------- GIHTHUB LOGIN PIECES ----------

    // // Verifies that the "Log in with GitHub" button redirects to GitHub.
    // @Test
    // @Order(4)
    // void loginWithGitHubButton() {
    //     WebElement githubLoginButton = wait.until(ExpectedConditions.elementToBeClickable(
    //         By.xpath("//button[contains(., 'Log in with GitHub')]")));
        
    //     githubLoginButton.click();
        
    //     wait.until(ExpectedConditions.urlContains("github.com"));
    //     assertTrue(driver.getCurrentUrl().contains("github.com"), 
    //     "Failed to redirect to GitHub login page");
    // }

    // // Clicks the Sign-In button and verifies successful login or error.
    // @Test
    // @Order(7)
    // void clickSignInButton() {
    //     WebElement signInButton = wait.until(ExpectedConditions.elementToBeClickable(
    //         By.xpath("//input[@type='submit' and @value='Sign in']")));
        
    //     signInButton.click();
        
    //     try {
    //         wait.until(ExpectedConditions.or(
    //             ExpectedConditions.urlContains("/"),
    //             ExpectedConditions.presenceOfElementLocated(By.className("flash-error"))
    //         ));
    //     } catch (Exception e) {
    //         fail("Sign in process did not complete - no redirect or error message detected");
    //     }
    // }

    // // Handles authorization if required and verifies redirection to the home page.
    // @Test
    // @Order(8)
    // void handleAuthorizeButton() {
    //     try {
    //         WebElement authorizeButton = wait.until(ExpectedConditions.elementToBeClickable(
    //             By.xpath("//button[@name='authorize' and @value='1']")));
    //         authorizeButton.click();
    //     } catch (org.openqa.selenium.TimeoutException e) {
    //         System.out.println("Authorization step skipped - already authorized");
    //     }

    //     wait.until(ExpectedConditions.urlMatches(".*/"));
    //     assertTrue(driver.getCurrentUrl().endsWith("/"),
    //         "Failed to redirect to home page after authorization");
    // }

    // // Logs out by clicking the logout button and verifies redirection to the login page.
    // @Test
    // @Order(9)
    // void logoutButton() {
    //     WebElement logoutButton = wait.until(ExpectedConditions.elementToBeClickable(
    //         By.xpath("//a[@href='/Login']")));
        
    //     logoutButton.click();
        
    //     wait.until(ExpectedConditions.urlContains("/Login"));
    //     assertTrue(driver.getCurrentUrl().endsWith("/Login"),
    //         "Failed to redirect to login page after clicking logout");
    // }

    // // Verifies that the GitHub login button is visible after logging out and verifies redirection.
    // @Test
    // @Order(10)
    // void verifyLogout() {
    //     WebElement githubLoginButton = wait.until(ExpectedConditions.presenceOfElementLocated(
    //         By.xpath("//button[contains(., 'Log in with GitHub')]")));
        
    //     assertTrue(githubLoginButton.isDisplayed(),
    //         "GitHub login button not visible after logout");
        
    //     githubLoginButton.click();
        
    //     wait.until(ExpectedConditions.urlContains("github.com"));
        
    //     WebElement signInButton = wait.until(ExpectedConditions.presenceOfElementLocated(
    //         By.xpath("//input[@type='submit' and @name='commit' and @value='Sign in']")));
        
    //     assertTrue(signInButton.isDisplayed(),
    //         "Not properly logged out - GitHub sign in page not showing");
    // }