/**
 * APP.JS - Root component
 * 
 * COMPONENT TREE:
 * 
 *   App
 *   └── TaskProvider (Context - global state)
 *       └── Dashboard
 *           ├── Header (title + create button)
 *           ├── FilterBar (status/priority filters + search)
 *           ├── StatsBar (count by status)
 *           ├── TaskList
 *           │   └── TaskCard (for each task)
 *           └── TaskForm (modal - shown when creating/editing)
 */

import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';

// ============================================================
// DASHBOARD - Main page component
// ============================================================
const Dashboard = () => {
    const { tasks, loading, error, filter, setFilter } = useTaskContext();
    const [showForm, setShowForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const handleCreateClick = () => {
        setTaskToEdit(null);  // Clear any existing edit task
        setShowForm(true);
    };

    const handleEditClick = (task) => {
        setTaskToEdit(task);  // Set the task to edit
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setTaskToEdit(null);
    };

    // Count tasks by status for stats bar
    const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'TODO').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length,
    };

    return (
        <div style={styles.app}>
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={styles.logo}>📋 TaskManager</h1>
                        <p style={styles.subtitle}>Built with Spring Boot + React + MySQL</p>
                    </div>
                    <button onClick={handleCreateClick} style={styles.createBtn}>
                        + New Task
                    </button>
                </div>
            </header>

            <main style={styles.main}>
                {/* STATS BAR */}
                <div style={styles.statsBar}>
                    {[
                        { label: 'Total', count: stats.total, color: '#4f46e5' },
                        { label: 'To Do', count: stats.todo, color: '#3182CE' },
                        { label: 'In Progress', count: stats.inProgress, color: '#D69E2E' },
                        { label: 'Completed', count: stats.completed, color: '#38A169' },
                    ].map(stat => (
                        <div key={stat.label} style={{ ...styles.statCard, borderTop: `4px solid ${stat.color}` }}>
                            <div style={{ ...styles.statCount, color: stat.color }}>{stat.count}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* FILTER BAR */}
                <div style={styles.filterBar}>
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="🔍 Search tasks..."
                        value={filter.search}
                        onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value, status: '', priority: '' }))}
                        style={styles.searchInput}
                    />

                    {/* Status Filter */}
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value, search: '' }))}
                        style={styles.filterSelect}
                    >
                        <option value="">All Statuses</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={filter.priority}
                        onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value, search: '' }))}
                        style={styles.filterSelect}
                    >
                        <option value="">All Priorities</option>
                        <option value="HIGH">High Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="LOW">Low Priority</option>
                    </select>

                    {/* Clear Filters */}
                    {(filter.status || filter.priority || filter.search) && (
                        <button
                            onClick={() => setFilter({ status: '', priority: '', search: '' })}
                            style={styles.clearBtn}
                        >
                            Clear ✕
                        </button>
                    )}
                </div>

                {/* TASK LIST */}
                {loading && (
                    <div style={styles.center}>
                        <div style={styles.spinner}></div>
                        <p>Loading tasks...</p>
                    </div>
                )}

                {error && (
                    <div style={styles.errorBox}>
                        ⚠️ {error}
                        <br />
                        <small>Make sure your Spring Boot backend is running on port 8080</small>
                    </div>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📝</div>
                        <h3>No tasks yet</h3>
                        <p>Click "New Task" to create your first task</p>
                    </div>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <div style={styles.taskGrid}>
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}         // key is required for lists in React
                                task={task}
                                onEdit={handleEditClick}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* MODAL FORM */}
            {showForm && (
                <TaskForm
                    taskToEdit={taskToEdit}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

// ============================================================
// APP - Root with Provider
// ============================================================
function App() {
    return (
        // TaskProvider wraps everything so all components can access context
        <TaskProvider>
            <Dashboard />
        </TaskProvider>
    );
}

const styles = {
    app: { minHeight: '100vh', backgroundColor: '#F7FAFC', fontFamily: 'system-ui, -apple-system, sans-serif' },
    header: { backgroundColor: '#4f46e5', color: 'white', padding: '20px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' },
    headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { margin: 0, fontSize: '1.8rem', fontWeight: '700' },
    subtitle: { margin: '4px 0 0', opacity: 0.8, fontSize: '0.85rem' },
    createBtn: { padding: '12px 24px', backgroundColor: 'white', color: '#4f46e5', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
    statsBar: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' },
    statCard: { background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    statCount: { fontSize: '2.2rem', fontWeight: '700' },
    statLabel: { fontSize: '0.85rem', color: '#718096', marginTop: '4px' },
    filterBar: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
    searchInput: { flex: 2, minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '1rem' },
    filterSelect: { flex: 1, minWidth: '150px', padding: '10px 14px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '0.95rem' },
    clearBtn: { padding: '10px 16px', borderRadius: '8px', border: '2px solid #FC8181', color: '#C53030', background: 'white', cursor: 'pointer', fontWeight: '600' },
    taskGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' },
    center: { textAlign: 'center', padding: '60px', color: '#718096' },
    spinner: { width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' },
    errorBox: { backgroundColor: '#FFF5F5', border: '1px solid #FC8181', borderRadius: '8px', padding: '16px', color: '#C53030', marginBottom: '16px' },
    emptyState: { textAlign: 'center', padding: '80px', color: '#718096' },
    emptyIcon: { fontSize: '4rem', marginBottom: '16px' }
};

export default App;
