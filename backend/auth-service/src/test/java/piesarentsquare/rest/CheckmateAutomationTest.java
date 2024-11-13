package piesarentsquare.rest;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
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
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            if (driver != null) {
                driver.quit();
            }
        }));
    }

    // Adds a delay after each test for stability.
    @AfterEach
    void addDelayAfterTest() throws InterruptedException {
        Thread.sleep(2000);
    }

    // Navigates to the login page and checks if the URL contains "login".
    @Test
    @Order(1)
    void navigateToSite() {
        driver.get("http://moxie.cs.oswego.edu:49000/login");
        
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

    // Checks that the login button on the registration page navigates to the login page.
    @Test
    @Order(3)
    void registrationPageLoginButton() {
        WebElement registrationPageLoginButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[@href='/Login' and text()='Log In ']")));
        
        registrationPageLoginButton.click();

        wait.until(ExpectedConditions.urlContains("/Login"));
        assertTrue(driver.getCurrentUrl().endsWith("/Login"),
            "Failed to redirect to login page after clicking log in");
    }

    // Verifies that the "Log in with GitHub" button redirects to GitHub.
    @Test
    @Order(4)
    void loginWithGitHubButton() {
        WebElement githubLoginButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(., 'Log in with GitHub')]")));
        
        githubLoginButton.click();
        
        wait.until(ExpectedConditions.urlContains("github.com"));
        assertTrue(driver.getCurrentUrl().contains("github.com"), 
        "Failed to redirect to GitHub login page");
    }

    // Inputs the email into the GitHub login form and verifies it was entered correctly.
    @Test
    @Order(5)
    void enterEmail() {
        WebElement emailInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("login_field")));
        
        emailInput.sendKeys(email);
        
        assertEquals(email, emailInput.getAttribute("value"),
            "Email was not properly entered into the field");
    }

    // Inputs the password into the GitHub login form and verifies it was entered.
    @Test
    @Order(6)
    void enterPassword() {
        WebElement passwordInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("password")));
        
        passwordInput.sendKeys(password);
        
        assertFalse(passwordInput.getAttribute("value").isEmpty(),
            "Password field is empty");
    }

    // Clicks the Sign-In button and verifies successful login or error.
    @Test
    @Order(7)
    void clickSignInButton() {
        WebElement signInButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//input[@type='submit' and @value='Sign in']")));
        
        signInButton.click();
        
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/"),
                ExpectedConditions.presenceOfElementLocated(By.className("flash-error"))
            ));
        } catch (Exception e) {
            fail("Sign in process did not complete - no redirect or error message detected");
        }
    }

    // Handles authorization if required and verifies redirection to the home page.
    @Test
    @Order(8)
    void handleAuthorizeButton() {
        try {
            WebElement authorizeButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[@name='authorize' and @value='1']")));
            authorizeButton.click();
        } catch (org.openqa.selenium.TimeoutException e) {
            System.out.println("Authorization step skipped - already authorized");
        }

        wait.until(ExpectedConditions.urlMatches(".*/"));
        assertTrue(driver.getCurrentUrl().endsWith("/"),
            "Failed to redirect to home page after authorization");
    }

    // Logs out by clicking the logout button and verifies redirection to the login page.
    @Test
    @Order(9)
    void logoutButton() {
        WebElement logoutButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[@href='/Login']")));
        
        logoutButton.click();
        
        wait.until(ExpectedConditions.urlContains("/Login"));
        assertTrue(driver.getCurrentUrl().endsWith("/Login"),
            "Failed to redirect to login page after clicking logout");
    }

    // Verifies that the GitHub login button is visible after logging out and verifies redirection.
    @Test
    @Order(10)
    void verifyLogout() {
        WebElement githubLoginButton = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//button[contains(., 'Log in with GitHub')]")));
        
        assertTrue(githubLoginButton.isDisplayed(),
            "GitHub login button not visible after logout");
        
        githubLoginButton.click();
        
        wait.until(ExpectedConditions.urlContains("github.com"));
        
        WebElement signInButton = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@type='submit' and @name='commit' and @value='Sign in']")));
        
        assertTrue(signInButton.isDisplayed(),
            "Not properly logged out - GitHub sign in page not showing");
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
