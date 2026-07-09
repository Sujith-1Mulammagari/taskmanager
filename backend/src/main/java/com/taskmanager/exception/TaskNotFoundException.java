package com.taskmanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * CUSTOM EXCEPTION - TaskNotFoundException
 * 
 * WHY create custom exceptions?
 * → So we can return meaningful HTTP status codes and messages
 * → Instead of a generic 500 error, user gets "Task with id 99 not found" + 404
 * 
 * @ResponseStatus(HttpStatus.NOT_FOUND) 
 * → Tells Spring: when this exception is thrown, return HTTP 404
 * 
 * extends RuntimeException 
 * → We extend RuntimeException so we DON'T need try-catch everywhere
 *   (RuntimeExceptions are unchecked exceptions)
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class TaskNotFoundException extends RuntimeException {

    /**
     * Constructor that takes the task ID
     * Creates a message like: "Task not found with id: 5"
     */
    public TaskNotFoundException(Long id) {
        super("Task not found with id: " + id);
    }

    /**
     * Constructor that takes a custom message
     */
    public TaskNotFoundException(String message) {
        super(message);
    }
}
