import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [savingTask, setSavingTask] = useState(false);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('API Error', error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const res = await fetch('/api/salesforce');
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Salesforce API Error', error);
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchContacts();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setSavingTask(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        console.error('Failed to save task', await res.text());
        return;
      }

      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      setNewTask('');
    } catch (error) {
      console.error('Save error', error);
    } finally {
      setSavingTask(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });

      if (!res.ok) {
        console.error('Toggle error', await res.text());
        return;
      }

      const updated = await res.json();
      setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      console.error('Toggle error', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        console.error('Delete error', await res.text());
        return;
      }
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Delete error', error);
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
          <h1 style={styles.title}>Unified Cloud Operations</h1>
          <p style={styles.subtitle}>
            Bringing Data Together: Vercel Serverless Edge, PostgreSQL, and Salesforce CRM.
          </p>
        </header>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>🐘 PostgreSQL Tasks</h2>
              <span style={styles.badge}>Live Database</span>
            </div>

            <form onSubmit={addTask} style={styles.form}>
              <input
                type="text"
                style={styles.input}
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button type="submit" style={styles.button} disabled={savingTask}>
                {savingTask ? 'Saving...' : 'Add'}
              </button>
            </form>

            {loadingTasks ? (
              <div style={styles.loader}>Loading tasks from the cloud database...</div>
            ) : (
              <ul style={styles.list}>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <li key={task.id} style={styles.listItem}>
                      <div style={styles.taskContent} onClick={() => toggleTask(task)}>
                        <div style={{ ...styles.checkbox, ...(task.completed ? styles.checkboxChecked : {}) }}>
                          {task.completed && '✓'}
                        </div>
                        <span style={{ ...styles.taskText, ...(task.completed ? styles.taskCompleted : {}) }}>
                          {task.text}
                        </span>
                      </div>
                      <button onClick={() => deleteTask(task.id)} style={styles.deleteBtn}>
                        Delete
                      </button>
                    </li>
                  ))
                ) : (
                  <li style={styles.emptyState}>No active tasks in database.</li>
                )}
              </ul>
            )}
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={{ ...styles.cardTitle, color: '#00a1e0' }}>☁️ Salesforce CRM</h2>
              <span style={styles.badgeBlue}>Real-time API</span>
            </div>

            <div style={styles.infoBox}>Syncing Accounts dynamically from your developer backend.</div>

            {loadingContacts ? (
              <div style={styles.loader}>Securely authenticating with Salesforce...</div>
            ) : (
              <ul style={styles.list}>
                {contacts.length > 0 ? (
                  contacts.map((c) => (
                    <li key={c.Id || c.id} style={styles.contactItem}>
                      <div style={styles.avatar}>{c.Name ? c.Name.charAt(0).toUpperCase() : '👤'}</div>
                      <div style={styles.contactDetails}>
                        <p style={styles.contactName}>{c.Name || 'Unknown'}</p>
                        <p style={styles.contactTitle}>{c.Title || 'Salesforce contact'}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li style={styles.emptyState}>No Salesforce contacts synced.</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '2rem 1rem',
    color: '#0f172a'
  },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    textAlign: 'center',
    borderTop: '6px solid #3b82f6'
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#64748b'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9'
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  badgeBlue: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  input: {
    flex: 1,
    padding: '0.95rem 1rem',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '1rem',
    color: '#0f172a'
  },
  button: {
    padding: '0.95rem 1.5rem',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: '700',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gap: '1rem'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.1rem 1.2rem',
    borderRadius: '16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0'
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.9rem',
    cursor: 'pointer'
  },
  checkbox: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    border: '2px solid #cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb'
  },
  taskText: {
    fontSize: '1rem',
    color: '#0f172a'
  },
  taskCompleted: {
    color: '#64748b',
    textDecoration: 'line-through'
  },
  deleteBtn: {
    border: 'none',
    backgroundColor: '#fecaca',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    fontWeight: '700',
    color: '#7f1d1d'
  },
  loader: {
    padding: '1.5rem',
    textAlign: 'center',
    color: '#64748b'
  },
  emptyState: {
    color: '#64748b',
    padding: '1rem 0'
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: '14px',
    padding: '1rem 1.2rem',
    marginBottom: '1.5rem',
    color: '#1d4ed8'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.9rem',
    padding: '1rem',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    display: 'grid',
    placeItems: 'center',
    fontWeight: '800'
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  contactName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '700'
  },
  contactTitle: {
    margin: '0.2rem 0 0 0',
    color: '#64748b'
  }
};
        gap: '10px',
        marginBottom: '1.5rem'
    },
    input: {
        flex: 1,
        padding: '12px 16px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    taskContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        flex: 1
    },
    checkbox: {
        width: '22px',
        height: '22px',
        borderRadius: '6px',
        border: '2px solid #cbd5e1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        transition: 'all 0.2s'
    },
    checkboxChecked: {
        backgroundColor: '#10b981',
        borderColor: '#10b981'
    },
    taskText: {
        fontSize: '1.05rem',
        fontWeight: '500',
        color: '#334155',
        transition: 'color 0.2s'
    },
    taskCompleted: {
        color: '#94a3b8',
        textDecoration: 'line-through'
    },
    deleteBtn: {
        backgroundColor: '#fef2f2',
        color: '#ef4444',
        border: '1px solid #fecaca',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    infoBox: {
        backgroundColor: '#f0fdfa',
        borderLeft: '4px solid #0ea5e9',
        padding: '12px',
        borderRadius: '4px',
        color: '#0c4a6e',
        fontSize: '0.9rem',
        marginBottom: '1.5rem'
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    avatar: {
        width: '46px',
        height: '46px',
        borderRadius: '23px',
        backgroundColor: '#e0f2fe',
        color: '#0284c7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold'
    },
    contactDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    contactName: {
        margin: 0,
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#1e293b'
    },
    contactTitle: {
        margin: 0,
        fontSize: '0.9rem',
        color: '#64748b'
    },
    loader: {
        textAlign: 'center',
        color: '#64748b',
        padding: '2rem',
        fontStyle: 'italic'
    },
    emptyState: {
        textAlign: 'center',
        padding: '2rem',
        color: '#94a3b8',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px dashed #e2e8f0'
    }
};import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [loadingContacts, setLoadingContacts] = useState(true);

    useEffect(() => {
        // 1. Fetch Cloud PostgreSQL Tasks
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => {
                setTasks(data);
                setLoadingTasks(false);
            })
            .catch(err => {
                console.error('API Error', err);
                setLoadingTasks(false);
            });

        // 2. Fetch Live Salesforce Cloud Contacts
        fetch('/api/salesforce')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setContacts(data);
                }
                setLoadingContacts(false);
            })
            .catch(err => {
                console.error('Salesforce API Error', err);
                setLoadingContacts(false);
            });
    }, []);

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f0f2f5' }}>
            <Head>
                <title>Enterprise Cloud Dashboard</title>
            </Head>

            <main style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Main Header Component */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ textAlign: 'center', color: '#2c3e50', margin: 0 }}>🚀 Enterprise Cloud Dashboard</h1>
                    <p style={{ textAlign: 'center', color: '#7f8c8d', marginTop: '10px' }}>
                        Vercel React Frontend + Vercel PostgreSQL + Salesforce CRM Connected!
                    </p>
                </div>

                {/* Dashboard Grid (Side by side on large screens) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>

                    {/* PostreSQL Panel */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', color: '#2980b9' }}>🐘 PostgreSQL Tasks</h2>

                        {loadingTasks ? (
                            <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>Querying Vercel Serverless Database...</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {tasks.length > 0 ? tasks.map(task => (
                                    <li key={task.id} style={{ padding: '12px 0', borderBottom: '1px solid #ecf0f1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>{task.completed ? '✅' : '⬜'}</span>
                                        <span style={{ color: '#34495e' }}>{task.text}</span>
                                    </li>
                                )) : <li style={{ color: '#e74c3c' }}>No tasks found in database.</li>}
                            </ul>
                        )}
                    </div>

                    {/* Salesforce Panel */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', color: '#00a1e0' }}>☁️ Salesforce CRM</h2>

                        {loadingContacts ? (
                            <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>Authenticating with Salesforce...</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {contacts.length > 0 ? contacts.map(c => (
                                    <li key={c.Id || c.id} style={{ padding: '12px 0', borderBottom: '1px solid #ecf0f1' }}>
                                        <strong style={{ color: '#2c3e50', fontSize: '18px' }}>{c.Name}</strong> <br />
                                        <span style={{ fontSize: '14px', color: '#7f8c8d' }}>{c.Title || 'Consultant / Lead'}</span>
                                    </li>
                                )) : <li style={{ color: '#e74c3c' }}>No contacts found or Auth Error.</li>}
                            </ul>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch true live data from the Database API
    useEffect(() => {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => {
                setTasks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('API Error', err);
                setLoading(false);
            });
    }, []);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f0f2f5' }}>
            <Head>
                <title>My Vercel React App</title>
            </Head>

            <main style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h1 style={{ textAlign: 'center', color: '#333' }}>🚀 Cloud Task Manager</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                    Fully working React frontend! No external APIs required. State is managed locally.
                </p>

                <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What do you want to build next?"
                        style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        Add Task
                    </button>
                </form>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {tasks.map(task => (
                        <li key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ flex: 1, fontSize: '18px', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#999' : '#333' }}>
                                {task.text}
                            </span>
                            <button onClick={() => deleteTask(task.id)} style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>

                {tasks.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>No tasks! You are all caught up.</p>
                )}
            </main>
        </div>
    );
}
