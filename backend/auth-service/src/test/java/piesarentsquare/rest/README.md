# CheckmateAutomationTest Guide

This series of tests created by the QA Team automates testing functionality within the web application, **CheckMate**.

The test script navigates through all pages, selecting buttons and entering details to ensure that each aspect of the project functions as intended. Think of it as your personal walkthrough.

## Prerequisites

As good practice, ensure the following are installed and up to date on your system:

- **Java**: Java Development Kit (JDK) is required.
- **Maven**: For managing project dependencies and running the test.
- **Chrome Browser**: ChromeDriver is used for browser automation.
- **WebDriverManager**: Handles WebDriver setup automatically.

## Environment Variables

To run this test, ensure the following environment variables are configured correctly:

- **CSC480_TEST_EMAIL**
- **CSC480_TEST_PASSWORD**

### Setup Instructions:

1. Note the email and password of the user you want to use for testing in a preferred text editor.

2. Define the environment variables on your local machine based on your operating system.

   #### Windows:

   1. Open the Start menu, search for **Environment Variables**, and select **Edit the system environment variables**.
   2. In the System Properties window, select **Environment Variables**.
   3. Under **User variables** or **System variables**, select **New**.
   4. Enter the variable name and value:
      - Variable name: `<your_email_here>`
      - Variable value: `<your_password_here>`
   5. Select **OK** to save and close all windows.

   #### Linux/Mac:

   1. Open the Terminal.
   2. Edit your shell profile with the command: `nano <your shell>` (usually `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`).
   3. Add the following lines:
      ```bash
      export CSC480_TEST_EMAIL= <your_email_here>
      export CSC480_TEST_PASSWORD= <your_password_here>
      ```
   4. Save and exit the shell profile.
   5. Exit the Terminal.

3. **Close and Reopen VSCode** to ensure it correctly retrieves the newly set environment variables.

4. Your environment is now ready for testing.

## Running the Tests

A simple and easy way to run the test is to **right-click** the file named **CheckmateAutomationTest.java** and select **Run Tests**.

**Note:** You should view the root **README.md** first before trying to run any of these tests.

Thank you for testing CheckMate!

