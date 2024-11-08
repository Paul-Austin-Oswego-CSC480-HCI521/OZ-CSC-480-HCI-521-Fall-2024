// package piesarentsquare.rest;

// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.openqa.selenium.By;
// import org.openqa.selenium.WebDriver;
// import org.openqa.selenium.WebElement;
// import org.openqa.selenium.chrome.ChromeDriver;
// import io.github.bonigarcia.wdm.WebDriverManager;

// import java.time.Duration;

// import static org.junit.jupiter.api.Assertions.assertTrue;

// class LoginAutomationTest {
//     private WebDriver driver;

//     @BeforeEach
//     void setUp() {
//         WebDriverManager.chromedriver().setup();  // This will ensure compatibility
//         driver = new ChromeDriver();
//         driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
//     }

//     @Test
//     void testLogin() {
//         // Navigate to the login page
//         driver.get("http://localhost:2080/login");

//         // Locate email input and enter the username
//         WebElement emailInput = driver.findElement(By.id("email"));
//         emailInput.sendKeys("user@gmail.com");

//         // Locate password input and enter the password
//         WebElement passwordInput = driver.findElement(By.id("password"));
//         passwordInput.sendKeys("password");

//         // Click the login button
//         WebElement loginButton = driver.findElement(By.xpath("//button[@type='submit']"));
//         loginButton.click();

//         // Check that the login was successful by verifying if the user was redirected
//         assertTrue(driver.getCurrentUrl().endsWith("/")); // Expected URL after login
//     }

//     @AfterEach
//     void tearDown() {
//         if (driver != null) {
//             driver.quit();
//         }
//     }
// }

