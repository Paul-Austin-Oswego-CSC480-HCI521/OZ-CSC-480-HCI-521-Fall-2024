package model;

public class Project {
    private int id;
    private String name;
    private String description;
    private String userEmail;
    private int trash;

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public int getTrash() { return trash; }
    public void setTrash(int trash) { this.trash = trash; }
}
