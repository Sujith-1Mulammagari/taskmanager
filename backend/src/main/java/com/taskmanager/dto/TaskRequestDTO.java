package com.taskmanager.dto;

import com.taskmanager.model.Task.TaskPriority;
import com.taskmanager.model.Task.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO = Data Transfer Object
 * 
 * WHY USE DTO instead of sending the Entity directly?
 * 
 * 1. SECURITY: Entity might have sensitive fields (passwords, internal IDs)
 *    DTO only exposes what the client needs
 * 
 * 2. VALIDATION: We put @NotBlank, @Size etc. on DTO fields
 *    These validations run BEFORE data reaches the database
 * 
 * 3. FLEXIBILITY: Frontend might send data in a different shape than DB stores it
 *    DTO bridges that gap
 * 
 * 4. DECOUPLING: If DB schema changes, DTO can stay the same (API doesn't break)
 * 
 * Flow: 
 *   Frontend → JSON → [TaskRequestDTO] → Service → [Task Entity] → Database
 *   Database → [Task Entity] → Service → [TaskResponseDTO] → JSON → Frontend
 */

// ============================================================
// REQUEST DTO - What frontend SENDS to us when creating/updating
// ============================================================
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequestDTO {

    @NotBlank(message = "Title cannot be empty")
    @Size(min = 1, max = 100, message = "Title must be between 1-100 characters")
    private String title;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private TaskStatus status;    // optional - defaults to TODO in entity

    private TaskPriority priority; // optional - defaults to MEDIUM in entity
}
