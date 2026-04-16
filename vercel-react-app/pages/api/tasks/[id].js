import { sql } from '@vercel/postgres';

const ensureTasksTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    );
  `;
};

export default async function handler(req, res) {
  const {
    query: { id }
  } = req;

  if (!id) {
    return res.status(400).json({ error: 'Task id is required.' });
  }

  await ensureTasksTable();

  if (req.method === 'PATCH') {
    try {
      const { completed } = req.body;
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be boolean.' });
      }

      const { rows } = await sql`
        UPDATE tasks
        SET completed = ${completed}
        WHERE id = ${Number(id)}
        RETURNING *;
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Unable to update task.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { rows } = await sql`
        DELETE FROM tasks
        WHERE id = ${Number(id)}
        RETURNING *;
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Unable to delete task.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
