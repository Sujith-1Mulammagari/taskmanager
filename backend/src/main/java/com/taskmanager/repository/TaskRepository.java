package com.taskmanager.repository;

import com.taskmanager.model.Task;
import com.taskmanager.model.Task.TaskStatus;
import com.taskmanager.model.Task.TaskPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * TASK REPOSITORY - Data Access Layer (talks to the database)
 * 
 * By extending JpaRepository<Task, Long>, we get these methods FOR FREE:
 *   - save(task)           → INSERT or UPDATE
 *   - findById(id)         → SELECT WHERE id = ?
 *   - findAll()            → SELECT * FROM tasks
 *   - deleteById(id)       → DELETE WHERE id = ?
 *   - count()              → SELECT COUNT(*)
 *   - existsById(id)       → SELECT COUNT(*) > 0
 * 
 * JpaRepository<Task, Long>
 *                ↑     ↑
 *         Entity Type  Primary Key Type
 * 
 * @Repository - marks this as a Spring-managed repository bean
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * DERIVED QUERY METHOD - Spring Data JPA reads the method name and generates SQL!
     * 
     * findByStatus(TaskStatus status)
     * → SELECT * FROM tasks WHERE status = ?
     * 
     * No SQL needed! Spring parses: find + By + Status
     */
    List<Task> findByStatus(TaskStatus status);

    /**
     * findByPriority(TaskPriority priority)
     * → SELECT * FROM tasks WHERE priority = ?
     */
    List<Task> findByPriority(TaskPriority priority);

    /**
     * findByStatusAndPriority(...)
     * → SELECT * FROM tasks WHERE status = ? AND priority = ?
     */
    List<Task> findByStatusAndPriority(TaskStatus status, TaskPriority priority);

    /**
     * findByTitleContainingIgnoreCase(...)
     * → SELECT * FROM tasks WHERE LOWER(title) LIKE LOWER('%keyword%')
     * Used for search functionality
     */
    List<Task> findByTitleContainingIgnoreCase(String keyword);

    /**
     * Custom JPQL query using @Query annotation
     * JPQL uses class names and field names (not table/column names)
     * 
     * This counts tasks grouped by status - useful for dashboard statistics
     */
    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> countTasksByStatus();

    /**
     * findByOrderByCreatedAtDesc()
     * → SELECT * FROM tasks ORDER BY created_at DESC
     * Returns newest tasks first
     */
    List<Task> findAllByOrderByCreatedAtDesc();
}
