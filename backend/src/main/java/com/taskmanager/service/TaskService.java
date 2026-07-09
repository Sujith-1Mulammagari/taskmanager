package com.taskmanager.service;

import com.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.exception.TaskNotFoundException;
import com.taskmanager.model.Task;
import com.taskmanager.model.Task.TaskStatus;
import com.taskmanager.model.Task.TaskPriority;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * TASK SERVICE - Business Logic Layer
 * 
 * LAYERED ARCHITECTURE (important concept for interviews!):
 * 
 *   Controller  →  Service  →  Repository  →  Database
 *   (HTTP layer)  (Logic)     (Data Access)    (MySQL)
 * 
 * WHY separate Service from Controller?
 * → Controller only handles HTTP (parsing requests, returning responses)
 * → Service contains BUSINESS LOGIC (rules, validation, processing)
 * → If you change business logic, you only change Service
 * → Service can be tested independently of HTTP
 * 
 * @Service - marks this as a Spring-managed service bean
 */
@Service
public class TaskService {

    /**
     * @Autowired - Spring automatically injects the TaskRepository bean here
     * This is called DEPENDENCY INJECTION (DI)
     * 
     * We use constructor injection (best practice) below
     */
    private final TaskRepository taskRepository;

    // Constructor injection - preferred over @Autowired on field
    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // ==============================
    // CREATE TASK
    // ==============================
    /**
     * Creates a new task
     * Flow: DTO → Entity → Save to DB → Response DTO
     */
    public TaskResponseDTO createTask(TaskRequestDTO requestDTO) {
        // Step 1: Convert DTO to Entity
        Task task = new Task();
        task.setTitle(requestDTO.getTitle());
        task.setDescription(requestDTO.getDescription());

        // Step 2: Set defaults if not provided
        task.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : TaskStatus.TODO);
        task.setPriority(requestDTO.getPriority() != null ? requestDTO.getPriority() : TaskPriority.MEDIUM);

        // Step 3: Save to database (Hibernate generates: INSERT INTO tasks ...)
        Task savedTask = taskRepository.save(task);

        // Step 4: Convert Entity to Response DTO and return
        return TaskResponseDTO.fromEntity(savedTask);
    }

    // ==============================
    // GET ALL TASKS
    // ==============================
    public List<TaskResponseDTO> getAllTasks() {
        // findAllByOrderByCreatedAtDesc() → newest tasks first
        List<Task> tasks = taskRepository.findAllByOrderByCreatedAtDesc();

        // Stream API: converts List<Task> → List<TaskResponseDTO>
        // For each task, call TaskResponseDTO.fromEntity(task)
        return tasks.stream()
                .map(TaskResponseDTO::fromEntity)  // method reference
                .collect(Collectors.toList());
    }

    // ==============================
    // GET TASK BY ID
    // ==============================
    public TaskResponseDTO getTaskById(Long id) {
        // findById returns Optional<Task>
        // .orElseThrow() throws exception if not found
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        return TaskResponseDTO.fromEntity(task);
    }

    // ==============================
    // UPDATE TASK
    // ==============================
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO requestDTO) {
        // First, check if task exists
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        // Update only the fields that were provided
        if (requestDTO.getTitle() != null) {
            existingTask.setTitle(requestDTO.getTitle());
        }
        if (requestDTO.getDescription() != null) {
            existingTask.setDescription(requestDTO.getDescription());
        }
        if (requestDTO.getStatus() != null) {
            existingTask.setStatus(requestDTO.getStatus());
        }
        if (requestDTO.getPriority() != null) {
            existingTask.setPriority(requestDTO.getPriority());
        }

        // Save triggers @PreUpdate which sets updatedAt automatically
        Task updatedTask = taskRepository.save(existingTask);
        return TaskResponseDTO.fromEntity(updatedTask);
    }

    // ==============================
    // DELETE TASK
    // ==============================
    public void deleteTask(Long id) {
        // Check if task exists first
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        taskRepository.deleteById(id);
    }

    // ==============================
    // FILTER BY STATUS
    // ==============================
    public List<TaskResponseDTO> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status)
                .stream()
                .map(TaskResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ==============================
    // FILTER BY PRIORITY
    // ==============================
    public List<TaskResponseDTO> getTasksByPriority(TaskPriority priority) {
        return taskRepository.findByPriority(priority)
                .stream()
                .map(TaskResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ==============================
    // SEARCH TASKS
    // ==============================
    public List<TaskResponseDTO> searchTasks(String keyword) {
        return taskRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(TaskResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ==============================
    // UPDATE STATUS ONLY
    // ==============================
    public TaskResponseDTO updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        task.setStatus(status);
        return TaskResponseDTO.fromEntity(taskRepository.save(task));
    }
}
