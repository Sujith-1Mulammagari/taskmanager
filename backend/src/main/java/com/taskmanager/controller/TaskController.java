package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.model.Task.TaskStatus;
import com.taskmanager.model.Task.TaskPriority;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * TASK CONTROLLER - REST API Layer
 * 
 * @RestController = @Controller + @ResponseBody
 *   → @Controller: marks this as a Spring MVC controller
 *   → @ResponseBody: automatically converts return values to JSON
 * 
 * @RequestMapping("/api/tasks") - all endpoints start with /api/tasks
 * 
 * @CrossOrigin - allows React (localhost:3000) to call this API
 *   Without this: browser blocks requests due to CORS policy
 * 
 * HTTP METHODS recap:
 *   GET    → Read data
 *   POST   → Create new data
 *   PUT    → Update entire resource
 *   PATCH  → Update part of resource
 *   DELETE → Delete data
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ============================================================
    // POST /api/tasks
    // Creates a new task
    // ============================================================
    /**
     * @PostMapping    - handles HTTP POST requests
     * @RequestBody    - reads JSON from request body and converts to DTO
     * @Valid          - triggers validation annotations on the DTO
     * ResponseEntity - lets us control HTTP status code in response
     */
    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskRequestDTO requestDTO) {
        TaskResponseDTO createdTask = taskService.createTask(requestDTO);
        // 201 CREATED is the correct status for successful creation
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    // ============================================================
    // GET /api/tasks
    // Returns all tasks (optionally filtered)
    // ============================================================
    /**
     * @RequestParam(required = false) - optional query parameters
     * 
     * Examples:
     *   GET /api/tasks               → all tasks
     *   GET /api/tasks?status=TODO   → only TODO tasks
     *   GET /api/tasks?priority=HIGH → only HIGH priority
     *   GET /api/tasks?search=meeting→ tasks with "meeting" in title
     */
    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) String search) {

        List<TaskResponseDTO> tasks;

        if (search != null && !search.isEmpty()) {
            tasks = taskService.searchTasks(search);
        } else if (status != null) {
            tasks = taskService.getTasksByStatus(status);
        } else if (priority != null) {
            tasks = taskService.getTasksByPriority(priority);
        } else {
            tasks = taskService.getAllTasks();
        }

        return ResponseEntity.ok(tasks); // 200 OK
    }

    // ============================================================
    // GET /api/tasks/{id}
    // Returns a single task by ID
    // ============================================================
    /**
     * @GetMapping("/{id}") - {id} is a PATH VARIABLE
     * @PathVariable - extracts the value from the URL
     * 
     * Example: GET /api/tasks/5 → id = 5
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id) {
        TaskResponseDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    // ============================================================
    // PUT /api/tasks/{id}
    // Updates a task completely
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO requestDTO) {
        TaskResponseDTO updatedTask = taskService.updateTask(id, requestDTO);
        return ResponseEntity.ok(updatedTask);
    }

    // ============================================================
    // PATCH /api/tasks/{id}/status
    // Updates only the status of a task
    // ============================================================
    /**
     * PATCH is used for partial updates
     * Example: PATCH /api/tasks/5/status?status=COMPLETED
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponseDTO> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status) {
        TaskResponseDTO updatedTask = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(updatedTask);
    }

    // ============================================================
    // DELETE /api/tasks/{id}
    // Deletes a task
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        // 204 NO CONTENT - success, but nothing to return in body
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
