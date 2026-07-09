package com.taskmanager.dto;

import com.taskmanager.model.Task;
import com.taskmanager.model.Task.TaskPriority;
import com.taskmanager.model.Task.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * RESPONSE DTO - What we SEND BACK to the frontend
 * 
 * Includes all fields the frontend needs to display
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDTO {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * STATIC FACTORY METHOD - converts a Task entity to TaskResponseDTO
     * 
     * Why static? So we can call TaskResponseDTO.fromEntity(task) 
     * without creating an object first
     * 
     * This is the "mapping" step: Entity → DTO
     */
    public static TaskResponseDTO fromEntity(Task task) {
        TaskResponseDTO dto = new TaskResponseDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
}
