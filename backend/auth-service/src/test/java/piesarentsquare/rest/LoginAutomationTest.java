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

        // // Locate email input and enter the username
        // WebElement emailInput = driver.findElement(By.id("email"));
        // emailInput.sendKeys("user@gmail.com");

        // // Locate password input and enter the password
        // WebElement passwordInput = driver.findElement(By.id("password"));
        // passwordInput.sendKeys("password");

        // // Click the login button
        // WebElement loginButton = driver.findElement(By.xpath("//button[@type='submit']"));
        // loginButton.click();

        Thread.sleep(5000);

        // Locate and click the "Log in with GitHub" button
        System.out.println("Attempting to find GitHub login button...");
        WebElement githubLoginButton = driver.findElement(By.xpath("//button[contains(., 'Log in with GitHub')]"));
        System.out.println("GitHub login button found, clicking it...");
        githubLoginButton.click();

        // Check that the login was successful by verifying if the user was redirected
        assertTrue(driver.getCurrentUrl().endsWith("/")); // Expected URL after login

        Thread.sleep(5000);

        System.out.println("Attempting to find GitHub login button...");
        WebElement githubLogoutButton = driver.findElement(By.xpath("//button[contains(., 'Log out')]"));
        githubLogoutButton.click();
        assertTrue(driver.getCurrentUrl().endsWith("/login")); // Expected URL after logout
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}

