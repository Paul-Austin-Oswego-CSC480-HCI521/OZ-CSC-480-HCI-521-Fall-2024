package piesarentsquare.rest;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class LibertyServerTest {
   // Store process to terminate it later
   private Process frontendProcess;

   private void runCommand(String directory, String command) throws IOException, InterruptedException {
       ProcessBuilder builder = new ProcessBuilder(command.split(" "));
       builder.directory(new File(directory)); // Set the working directory
       Process process = builder.start();
       process.waitFor();

       int exitCode = process.exitValue();
       assertEquals(0, exitCode, "Command failed with exit code: " + exitCode);

       System.out.println("Command '" + command + "' executed successfully in " + directory);
   }
   private void runCommandInBackground(String directory, String command) throws IOException {
       ProcessBuilder builder = new ProcessBuilder(command.split(" "));
       builder.directory(new File(directory)); // Set the working directory
       frontendProcess = builder.start(); // Store process for termination later

       System.out.println("Command '" + command + "' started in background in " + directory);
   }
   // Send SIGINT to the frontend process
   private void sendSigintToProcess(Process process) throws IOException {
       if (process != null && process.isAlive()) {
           long pid = process.pid(); // Get PID (Requires Java 9+)
           // Send SIGINT to the process
           ProcessBuilder killBuilder = new ProcessBuilder("kill", "-SIGINT", Long.toString(pid));
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
   @Timeout(80)
   void testStartAndStopBackendAndFrontend() {
       try {
           runCommand("../../backend/auth-service", "mvn liberty:start");
           runCommand("../database-service", "mvn liberty:start");

           runCommand("../../frontend", "npm i");
           runCommandInBackground("../../frontend", "npm run dev");

           Thread.sleep(30000);

           runCommand("../../backend/auth-service", "mvn liberty:stop");
           runCommand("../../backend/database-service", "mvn liberty:stop");
           sendSigintToProcess(frontendProcess);


       } catch (IOException | InterruptedException e) {
           fail("Exception during execution: " + e.getMessage());
       }
   }
}
