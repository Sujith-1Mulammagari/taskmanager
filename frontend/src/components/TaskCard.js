/**
 * TASK CARD COMPONENT
 * 
 * Displays a single task with:
 * - Title, description, status badge, priority badge
 * - Edit and Delete buttons
 * - Quick status change buttons
 * 
 * Props:
 *   task    - the task object from backend
 *   onEdit  - callback function when edit button clicked
 */

import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const TaskCard = ({ task, onEdit }) => {
    const { removeTask, changeStatus } = useTaskContext();
    const [deleting, setDeleting] = useState(false);

    // ============================================================
    // HELPER FUNCTIONS - pure functions, no side effects
    // ============================================================

    const getStatusColor = (status) => {
        switch (status) {
            case 'TODO': return { bg: '#EBF4FF', text: '#2B6CB0' };
            case 'IN_PROGRESS': return { bg: '#FFFBEB', text: '#B7791F' };
            case 'COMPLETED': return { bg: '#F0FFF4', text: '#276749' };
            default: return { bg: '#F7FAFC', text: '#4A5568' };
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return { bg: '#FFF5F5', text: '#C53030' };
            case 'MEDIUM': return { bg: '#FFFBEB', text: '#B7791F' };
            case 'LOW': return { bg: '#F0FFF4', text: '#276749' };
            default: return { bg: '#F7FAFC', text: '#4A5568' };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'TODO': return '📋';
            case 'IN_PROGRESS': return '🔄';
            case 'COMPLETED': return '✅';
            default: return '📌';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    // ============================================================
    // EVENT HANDLERS
    // ============================================================

    const handleDelete = async () => {
        if (window.confirm(`Delete "${task.title}"?`)) {
            setDeleting(true);
            await removeTask(task.id);
            // Note: don't setDeleting(false) - component will unmount on success
        }
    };

    const handleStatusChange = (e) => {
        changeStatus(task.id, e.target.value);
    };

    const statusColor = getStatusColor(task.status);
    const priorityColor = getPriorityColor(task.priority);

    return (
        <div style={{
            ...styles.card,
            opacity: deleting ? 0.5 : 1,
            borderLeft: `4px solid ${task.priority === 'HIGH' ? '#FC8181' : task.priority === 'MEDIUM' ? '#F6AD55' : '#68D391'}`
        }}>
            {/* HEADER: Title + Actions */}
            <div style={styles.header}>
                <h3 style={{
                    ...styles.title,
                    textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                    color: task.status === 'COMPLETED' ? '#A0AEC0' : '#2D3748'
                }}>
                    {getStatusIcon(task.status)} {task.title}
                </h3>
                <div style={styles.actions}>
                    <button onClick={() => onEdit(task)} style={styles.editBtn} title="Edit task">
                        ✏️
                    </button>
                    <button onClick={handleDelete} style={styles.deleteBtn} title="Delete task" disabled={deleting}>
                        🗑️
                    </button>
                </div>
            </div>

            {/* DESCRIPTION */}
            {task.description && (
                <p style={styles.description}>{task.description}</p>
            )}

            {/* BADGES ROW */}
            <div style={styles.badges}>
                {/* Status Badge */}
                <span style={{ ...styles.badge, backgroundColor: statusColor.bg, color: statusColor.text }}>
                    {task.status.replace('_', ' ')}
                </span>
                {/* Priority Badge */}
                <span style={{ ...styles.badge, backgroundColor: priorityColor.bg, color: priorityColor.text }}>
                    {task.priority}
                </span>
            </div>

            {/* QUICK STATUS CHANGE */}
            <div style={styles.statusChange}>
                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    style={styles.statusSelect}
                >
                    <option value="TODO">Move to: To Do</option>
                    <option value="IN_PROGRESS">Move to: In Progress</option>
                    <option value="COMPLETED">Move to: Completed</option>
                </select>
            </div>

            {/* FOOTER: Dates */}
            <div style={styles.footer}>
                <span style={styles.date}>Created: {formatDate(task.createdAt)}</span>
                {task.updatedAt !== task.createdAt && (
                    <span style={styles.date}>Updated: {formatDate(task.updatedAt)}</span>
                )}
            </div>
        </div>
    );
};

const styles = {
    card: {
        background: 'white', borderRadius: '12px', padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '16px',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
    title: { margin: 0, fontSize: '1.05rem', fontWeight: '600', flex: 1, marginRight: '12px' },
    actions: { display: 'flex', gap: '8px', flexShrink: 0 },
    editBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '4px', borderRadius: '6px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '4px', borderRadius: '6px' },
    description: { color: '#718096', fontSize: '0.9rem', margin: '8px 0 12px', lineHeight: '1.5' },
    badges: { display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' },
    badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
    statusChange: { marginBottom: '12px' },
    statusSelect: { padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#4a5568', cursor: 'pointer', width: '100%' },
    footer: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f7fafc', paddingTop: '8px' },
    date: { fontSize: '0.75rem', color: '#A0AEC0' }
};

export default TaskCard;
