package com.taskmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * TASK ENTITY - This maps directly to a 'tasks' table in MySQL
 * 
 * @Entity  - tells JPA/Hibernate: "this class = a database table"
 * @Table   - specifies the exact table name
 * @Data    - Lombok generates getters, setters, toString, equals, hashCode
 * @NoArgsConstructor - Lombok generates empty constructor (required by JPA)
 * @AllArgsConstructor - Lombok generates constructor with all fields
 */
@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    /**
     * @Id - marks this field as the PRIMARY KEY
     * @GeneratedValue - AUTO_INCREMENT in MySQL (1, 2, 3, 4...)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @NotBlank - validation: title cannot be empty or null
     * @Size     - validation: title must be between 1 and 100 characters
     * @Column   - maps to a column named 'title', cannot be null
     */
    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 100, message = "Title must be between 1 and 100 characters")
    @Column(name = "title", nullable = false)
    private String title;

    /**
     * Description is optional (nullable = true by default)
     */
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    /**
     * Status of the task: TODO, IN_PROGRESS, COMPLETED
     * @Enumerated(EnumType.STRING) - saves "TODO" as a string in DB, not 0/1/2
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status = TaskStatus.TODO; // Default value is TODO

    /**
     * Priority: LOW, MEDIUM, HIGH
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;

    /**
     * @Column(updatable = false) - this field is set once and never changed
     * We set it manually in @PrePersist
     */
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * @PrePersist - runs BEFORE the entity is first saved to DB
     * Sets createdAt and updatedAt automatically
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * @PreUpdate - runs BEFORE every update to the DB row
     * Updates the updatedAt timestamp automatically
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ==============================
    // ENUMS (defined inside the class)
    // ==============================

    /**
     * TaskStatus enum - represents the 3 possible states of a task
     */
    public enum TaskStatus {
        TODO,        // Task not started
        IN_PROGRESS, // Task being worked on
        COMPLETED    // Task finished
    }

    /**
     * TaskPriority enum - how urgent/important a task is
     */
    public enum TaskPriority {
        LOW,
        MEDIUM,
        HIGH
    }
}
