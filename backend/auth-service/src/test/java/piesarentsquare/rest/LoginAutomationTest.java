package piesarentsquare.rest;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

class LoginAutomationTest {
    private WebDriver driver;

    @BeforeEach
    void setUp() {
        WebDriverManager.chromedriver().setup();  // This will ensure compatibility
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @Test
    void testLogin() throws InterruptedException {
        // Navigate to the login page
        driver.get("http://moxie.cs.oswego.edu:49000/login");

        // Retrieve email and password from environment variables
        String email = System.getenv("CSC480_TEST_EMAIL");
        String password = System.getenv("CSC480_TEST_PASSWORD");

        // Click the login button
        WebElement loginButton = driver.findElement(By.xpath("//button[@type='submit']"));
        loginButton.click();
        Thread.sleep(5000);

        // Locate and click the "Log in with GitHub" button
        System.out.println("\nAttempting to find GitHub login button...");
        WebElement githubLoginButton = driver.findElement(By.xpath("//button[contains(., 'Log in with GitHub')]"));
        System.out.println("GitHub login button found, clicking it...\n");
        githubLoginButton.click();
        Thread.sleep(3000);

        // Locate email input and enter the email
        WebElement emailInput = driver.findElement(By.id("login_field"));
        emailInput.sendKeys(email);
        Thread.sleep(3000);

        // Locate password input and enter the password
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys(password);
        Thread.sleep(3000);

        // Locate and click the "sign in" button
        System.out.println("Attempting to find sign in button...");
        WebElement signInButton = driver.findElement(By.xpath("//input[@type='submit' and @value='Sign in']"));
        System.out.println("Sign in login button found, clicking it...\n");
        signInButton.click();
        Thread.sleep(3000);

        // Attempt to locate and click the "Authorize" button if it exists
        System.out.println("Attempting to find authorize button...");
        try {
            WebElement authorizeButton = driver.findElement(By.xpath("//button[@name='authorize' and @value='1']"));
            System.out.println("Authorize button found, clicking it...");
            authorizeButton.click();
        } catch (org.openqa.selenium.NoSuchElementException e) {
            System.out.println("Authorize button not found, skipping...\n");
        }   


        // Check that the login was successful by verifying the current URL
        assertTrue(driver.getCurrentUrl().endsWith("/")); // Expected URL after login
        Thread.sleep(3000);

        // Locate and click the "Log out" button
        System.out.println("Attempting to find logout button...");
        WebElement logoutButton = driver.findElement(By.xpath("//a[@href='/Login']"));
        System.out.println("Logout login button found, clicking it...\n");
        logoutButton.click();
        Thread.sleep(3000);
        
         // Check that the logout was successful by verifying the current URL
        assertTrue(driver.getCurrentUrl().endsWith("/Login")); // Expected URL after logout
        System.out.println("Logout was successful! Thank you for testing CheckMate!");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}


