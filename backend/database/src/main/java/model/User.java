package model;

public class User {
    private String username;
    private String email;
    private String password;

    public User() {}
    public User(String email) { this.email = email; }
    public User(String email, String password) { this.email = email; this.password = password; }

    //Getters and setters

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
