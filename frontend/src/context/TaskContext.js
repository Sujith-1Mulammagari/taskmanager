/**
 * TASK CONTEXT - Global State Management
 * 
 * WHAT IS CONTEXT?
 * React Context solves the "prop drilling" problem:
 * 
 * WITHOUT Context (prop drilling):
 *   App → passes tasks → Header → passes tasks → TaskList → passes tasks → TaskItem
 *   (every component has to pass props down, even if it doesn't use them)
 * 
 * WITH Context:
 *   Any component can directly access tasks without prop drilling
 *   TaskItem can call deleteTask() directly without App knowing
 * 
 * THREE parts of Context:
 *   1. createContext()     - creates the context object
 *   2. Provider            - wraps the app and provides the value
 *   3. useContext()        - hook to consume the context value
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as taskService from '../services/taskService';

// Step 1: Create the context
const TaskContext = createContext();

/**
 * TASK PROVIDER - wraps the entire app
 * All children can access tasks, loading, error, and task functions
 */
export const TaskProvider = ({ children }) => {
    // useState: when this changes, React re-renders the component
    const [tasks, setTasks] = useState([]);           // List of all tasks
    const [loading, setLoading] = useState(false);    // Show spinner while fetching
    const [error, setError] = useState(null);         // Error message to display
    const [filter, setFilter] = useState({            // Current filter state
        status: '',
        priority: '',
        search: ''
    });

    /**
     * FETCH TASKS
     * useCallback memoizes the function so it doesn't recreate on every render
     * Only recreates when 'filter' changes
     */
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Build params object (only include non-empty values)
            const params = {};
            if (filter.search) params.search = filter.search;
            else if (filter.status) params.status = filter.status;
            else if (filter.priority) params.priority = filter.priority;

            const response = await taskService.getAllTasks(params);
            setTasks(response.data); // response.data is the List<TaskResponseDTO> from Spring
        } catch (err) {
            setError('Failed to fetch tasks. Is the backend running?');
            console.error(err);
        } finally {
            setLoading(false); // Always stop loading spinner
        }
    }, [filter]);

    /**
     * useEffect - runs after component mounts and when 'fetchTasks' changes
     * This fetches tasks whenever filter changes
     */
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    /**
     * CREATE TASK
     * async/await: wait for API call to complete before updating state
     */
    const addTask = async (taskData) => {
        try {
            const response = await taskService.createTask(taskData);
            // Add new task to the beginning of the list (no need to re-fetch all)
            setTasks(prev => [response.data, ...prev]);
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.title || 'Failed to create task';
            return { success: false, error: errorMsg };
        }
    };

    /**
     * UPDATE TASK
     */
    const editTask = async (id, taskData) => {
        try {
            const response = await taskService.updateTask(id, taskData);
            // Replace the old task with updated task in the list
            setTasks(prev => prev.map(task =>
                task.id === id ? response.data : task
            ));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to update task' };
        }
    };

    /**
     * REMOVE TASK
     */
    const removeTask = async (id) => {
        try {
            await taskService.deleteTask(id);
            // Remove deleted task from state
            setTasks(prev => prev.filter(task => task.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete task' };
        }
    };

    /**
     * QUICK STATUS UPDATE (drag-and-drop style)
     */
    const changeStatus = async (id, status) => {
        try {
            const response = await taskService.updateTaskStatus(id, status);
            setTasks(prev => prev.map(task =>
                task.id === id ? response.data : task
            ));
        } catch (err) {
            console.error('Failed to update status');
        }
    };

    // Value object: everything components can access
    const value = {
        tasks,
        loading,
        error,
        filter,
        setFilter,
        addTask,
        editTask,
        removeTask,
        changeStatus,
        fetchTasks
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

/**
 * CUSTOM HOOK - useTaskContext
 * Makes it easy to use the context in any component:
 * 
 * const { tasks, addTask, loading } = useTaskContext();
 * 
 * Instead of:
 * const { tasks, addTask, loading } = useContext(TaskContext);
 */
export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used inside TaskProvider');
    }
    return context;
};
