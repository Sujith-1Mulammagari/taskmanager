/**
 * TASK FORM COMPONENT
 * 
 * Used for both CREATE and EDIT operations
 * If 'taskToEdit' prop is passed → Edit mode
 * If no prop → Create mode
 * 
 * KEY CONCEPTS:
 * - Controlled components: input values are controlled by React state
 * - Form validation: check data before submitting
 * - Conditional rendering: show different UI based on state
 */

import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';

const TaskForm = ({ taskToEdit, onClose }) => {
    const { addTask, editTask } = useTaskContext();

    // Form state - each field is controlled by React
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM'
    });

    const [errors, setErrors] = useState({});     // Field-level errors
    const [submitting, setSubmitting] = useState(false);

    const isEditMode = !!taskToEdit; // !! converts to boolean

    /**
     * useEffect: when taskToEdit changes, populate form with existing data
     * This runs when the component mounts and when taskToEdit changes
     */
    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                status: taskToEdit.status || 'TODO',
                priority: taskToEdit.priority || 'MEDIUM'
            });
        }
    }, [taskToEdit]);

    /**
     * CONTROLLED INPUT HANDLER
     * One function handles ALL input changes
     * [e.target.name]: uses computed property key to set the right field
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    /**
     * CLIENT-SIDE VALIDATION
     * Always validate on frontend too (don't rely only on backend)
     */
    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be under 100 characters';
        }
        if (formData.description.length > 500) {
            newErrors.description = 'Description must be under 500 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // true if no errors
    };

    /**
     * FORM SUBMIT HANDLER
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload on form submit!

        if (!validate()) return; // Stop if validation fails

        setSubmitting(true);
        try {
            let result;
            if (isEditMode) {
                result = await editTask(taskToEdit.id, formData);
            } else {
                result = await addTask(formData);
            }

            if (result.success) {
                onClose(); // Close modal on success
            } else {
                setErrors({ submit: result.error });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>
                    {isEditMode ? '✏️ Edit Task' : '➕ Create New Task'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* TITLE FIELD */}
                    <div style={styles.field}>
                        <label style={styles.label}>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title..."
                            style={{
                                ...styles.input,
                                borderColor: errors.title ? '#e53e3e' : '#e2e8f0'
                            }}
                        />
                        {errors.title && <span style={styles.error}>{errors.title}</span>}
                    </div>

                    {/* DESCRIPTION FIELD */}
                    <div style={styles.field}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Task description (optional)..."
                            rows={3}
                            style={styles.textarea}
                        />
                        {errors.description && <span style={styles.error}>{errors.description}</span>}
                    </div>

                    {/* STATUS & PRIORITY ROW */}
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} style={styles.select}>
                                <option value="TODO">📋 To Do</option>
                                <option value="IN_PROGRESS">🔄 In Progress</option>
                                <option value="COMPLETED">✅ Completed</option>
                            </select>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} style={styles.select}>
                                <option value="LOW">🟢 Low</option>
                                <option value="MEDIUM">🟡 Medium</option>
                                <option value="HIGH">🔴 High</option>
                            </select>
                        </div>
                    </div>

                    {/* SUBMIT ERROR */}
                    {errors.submit && <p style={styles.error}>{errors.submit}</p>}

                    {/* BUTTONS */}
                    <div style={styles.buttons}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} style={styles.submitBtn}>
                            {submitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        background: 'white', borderRadius: '12px', padding: '32px',
        width: '90%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    title: { margin: '0 0 24px', fontSize: '1.4rem', color: '#2d3748' },
    field: { marginBottom: '16px', flex: 1 },
    label: { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568', fontSize: '0.9rem' },
    input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem' },
    row: { display: 'flex', gap: '16px' },
    error: { color: '#e53e3e', fontSize: '0.8rem', marginTop: '4px' },
    buttons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
    cancelBtn: { padding: '10px 20px', borderRadius: '8px', border: '2px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '1rem' },
    submitBtn: { padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }
};

export default TaskForm;
