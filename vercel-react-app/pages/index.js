import { useEffect, useState } from 'react';
import Head from 'next/head';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [savingTask, setSavingTask] = useState(false);
  const [queryError, setQueryError] = useState('');

  const buildTaskUrl = () => {
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    return `/api/tasks?${params.toString()}`;
  };

  const fetchTasks = async () => {
    setLoadingTasks(true);
    setQueryError('');
    try {
      const res = await fetch(buildTaskUrl());
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Task query error', error);
      setQueryError('Unable to load tasks.');
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const res = await fetch('/api/salesforce');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Salesforce error', error);
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchContacts();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchTasks();
  };

  const addTask = async (event) => {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setSavingTask(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error(await res.text());
      setNewTask('');
      await fetchTasks();
    } catch (error) {
      console.error('Add task failed', error);
      setQueryError('Failed to add task.');
    } finally {
      setSavingTask(false);
    }
  };

  const toggleTaskCompletion = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchTasks();
    } catch (error) {
      console.error('Toggle task failed', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await fetchTasks();
    } catch (error) {
      console.error('Delete task failed', error);
    }
  };

  return (
    <div style={styles.page}>
      <Head>
        <title>Enterprise Cloud Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Enterprise Cloud Dashboard</h1>
          <p style={styles.subtitle}>
            Add tasks, run queries, filter results, and sync Salesforce contacts.
          </p>
        </header>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Task Query Center</h2>
              <p style={styles.sectionDescription}>
                Create tasks, search text, filter by status, and manage task state.
              </p>
            </div>
            <div style={styles.taskSummary}>
              <span>{tasks.length} tasks loaded</span>
              <span>{statusFilter === 'all' ? 'Showing all' : `${statusFilter} tasks`}</span>
            </div>
          </div>

          <form onSubmit={addTask} style={styles.createForm}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new query/task..."
              style={styles.createInput}
            />
            <button type="submit" style={styles.primaryButton} disabled={savingTask}>
              {savingTask ? 'Saving...' : 'Add Task'}
            </button>
          </form>

          <form onSubmit={handleSearch} style={styles.filterForm}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search task text or queries"
              style={styles.filterInput}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="submit" style={styles.secondaryButton}>
              Run Query
            </button>
          </form>

          {queryError ? <div style={styles.errorBox}>{queryError}</div> : null}

          {loadingTasks ? (
            <div style={styles.loader}>Loading tasks...</div>
          ) : (
            <ul style={styles.taskList}>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <li key={task.id} style={styles.taskItem}>
                    <button
                      onClick={() => toggleTaskCompletion(task)}
                      style={{
                        ...styles.checkButton,
                        ...(task.completed ? styles.checkButtonActive : {})
                      }}
                      aria-label="Toggle completion"
                    >
                      {task.completed ? '✓' : ''}
                    </button>
                    <div style={styles.taskTextWrapper}>
                      <span style={{ ...styles.taskText, ...(task.completed ? styles.taskCompleted : {}) }}>
                        {task.text}
                      </span>
                      <span style={styles.taskMeta}>
                        ID: {task.id} • {task.completed ? 'Completed' : 'Open'}
                      </span>
                    </div>
                    <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <li style={styles.emptyState}>No tasks match this query.</li>
              )}
            </ul>
          )}
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Salesforce Contacts</h2>
              <p style={styles.sectionDescription}>
                Live API results from Salesforce, including contact name and title.
              </p>
            </div>
          </div>

          {loadingContacts ? (
            <div style={styles.loader}>Loading contacts...</div>
          ) : (
            <ul style={styles.contactList}>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <li key={contact.Id || contact.id} style={styles.contactItem}>
                    <div style={styles.avatar}>{(contact.Name || contact.name || 'C')[0]}</div>
                    <div>
                      <p style={styles.contactName}>{contact.Name || contact.name || 'Unknown'}</p>
                      <p style={styles.contactTitle}>{contact.Title || contact.title || 'No title'}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li style={styles.emptyState}>No Salesforce data available yet.</li>
              )}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '2rem',
    backgroundColor: '#f1f5f9',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#0f172a'
  },
  main: {
    maxWidth: '1140px',
    margin: '0 auto',
    display: 'grid',
    gap: '2rem'
  },
  header: {
    padding: '2rem',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    color: '#ffffff',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.15)'
  },
  title: {
    margin: 0,
    fontSize: '2.8rem',
    letterSpacing: '-0.05em'
  },
  subtitle: {
    marginTop: '0.75rem',
    maxWidth: '700px',
    lineHeight: 1.7,
    opacity: 0.92
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '1.75rem',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)'
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.5rem'
  },
  sectionDescription: {
    margin: '0.5rem 0 0 0',
    color: '#475569'
  },
  taskSummary: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    color: '#64748b'
  },
  createForm: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  createInput: {
    width: '100%',
    padding: '1rem 1.1rem',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem'
  },
  filterForm: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr auto',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  filterInput: {
    width: '100%',
    padding: '0.98rem 1rem',
    borderRadius: '16px',
    border: '1px solid #cbd5e1'
  },
  filterSelect: {
    padding: '0.98rem 1rem',
    borderRadius: '16px',
    border: '1px solid #cbd5e1'
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '16px',
    color: '#ffffff',
    fontWeight: '700',
    cursor: 'pointer'
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    border: 'none',
    borderRadius: '16px',
    color: '#0f172a',
    fontWeight: '700',
    cursor: 'pointer'
  },
  loader: {
    padding: '1.5rem',
    color: '#64748b'
  },
  errorBox: {
    marginBottom: '1rem',
    padding: '1rem',
    borderRadius: '16px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c'
  },
  taskList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gap: '0.85rem'
  },
  taskItem: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gap: '1rem',
    alignItems: 'center',
    padding: '1.1rem 1.2rem',
    borderRadius: '18px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  checkButton: {
    width: '42px',
    height: '42px',
    borderRadius: '14px',
    border: '2px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#ffffff',
    fontWeight: '700',
    cursor: 'pointer'
  },
  checkButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#16a34a'
  },
  taskTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  taskText: {
    margin: 0,
    fontSize: '1rem'
  },
  taskCompleted: {
    textDecoration: 'line-through',
    color: '#64748b'
  },
  taskMeta: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '0.9rem'
  },
  deleteButton: {
    border: 'none',
    borderRadius: '14px',
    padding: '0.8rem 1rem',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontWeight: '700',
    cursor: 'pointer'
  },
  emptyState: {
    padding: '1rem',
    color: '#475569'
  },
  contactList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gap: '0.85rem'
  },
  contactItem: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem 1.1rem',
    borderRadius: '18px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: '700',
    color: '#0f172a'
  },
  contactName: {
    margin: 0,
    fontWeight: '700'
  },
  contactTitle: {
    margin: '0.2rem 0 0 0',
    color: '#64748b'
  }
};
