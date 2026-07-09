package com.taskmanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * GLOBAL EXCEPTION HANDLER
 * 
 * @RestControllerAdvice = @ControllerAdvice + @ResponseBody
 * 
 * This class INTERCEPTS exceptions thrown anywhere in the app
 * and converts them into proper JSON error responses
 * 
 * WITHOUT this: Spring returns ugly HTML error pages
 * WITH this: Spring returns clean JSON like:
 * {
 *   "timestamp": "2024-01-15T10:30:00",
 *   "status": 404,
 *   "error": "Task not found with id: 99",
 *   "path": "/api/tasks/99"
 * }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles TaskNotFoundException (when task ID doesn't exist)
     * Returns HTTP 404 Not Found
     */
    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleTaskNotFoundException(
            TaskNotFoundException ex) {

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.NOT_FOUND.value()); // 404
        errorResponse.put("error", ex.getMessage());

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles validation errors (@Valid annotation failures)
     * 
     * Example: If title is blank, this catches that and returns:
     * {
     *   "title": "Title cannot be empty",
     *   "description": "Description cannot exceed 500 characters"
     * }
     * 
     * Returns HTTP 400 Bad Request
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        // Loop through all validation errors and collect field name → error message
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField(); // e.g., "title"
            String errorMessage = error.getDefaultMessage();    // e.g., "Title cannot be empty"
            errors.put(fieldName, errorMessage);
        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Catch-all handler for any unexpected exceptions
     * Returns HTTP 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
        errorResponse.put("error", "An unexpected error occurred: " + ex.getMessage());

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
