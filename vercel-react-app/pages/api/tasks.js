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
  await ensureTasksTable();

  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM tasks ORDER BY id ASC;`;
      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Unable to read tasks from database.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Task text is required.' });
      }

      const { rows } = await sql`
        INSERT INTO tasks (text) VALUES (${text.trim()}) RETURNING *;
      `;
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Unable to create task.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
